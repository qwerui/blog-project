import express from 'express'; // package.json에서 type: module을 설정하면 가능하다.
import cookieParser from 'cookie-parser';
import { body, query, validationResult } from 'express-validator';
import { scheduleJob } from 'node-schedule';
import { v4 } from 'uuid';
import { createClient } from 'redis';
import cors from 'cors';
import fs from 'fs';
import https from 'https';

import JwtService from './jwt.js';
import memberService from './member-service.js';

const app = express();
const port = 8081;

const redisClient = await createClient({
    url: 'redis://localhost:6379',
    password: 'tokenpass',
})
    .on('error', err => {
        console.log('Redis Client Error', err);
        process.exit(1);
    })
    .connect();

memberService.init();

// DB 연결 해제 이벤트 등록
process.on("SIGINT", async () => {
    await redisClient.quit();
    await memberService.pool.end();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await redisClient.quit();
    await memberService.pool.end();
    process.exit(0);
});

const dayof14 = 60 * 60 * 24 * 14 * 1000;

const accessService = new JwtService("RS256", "1h");
const refreshService = new JwtService("RS256", "14d");

accessService.GenerateJwks();
refreshService.GenerateJwks();

// Jwks Rotation
const accessRotation = scheduleJob("0 0 0/4 * * *", () => {
    accessService.GenerateJwks();
})

const refreshRotation = scheduleJob("0 0 0 * * 1", () => {
    refreshService.GenerateJwks();
})

const iss = "http://blog-auth";
const aud = "http://blog-service";

app.use(cors({
    origin: 'https://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/auth/.well-known", (req, res) => {
    res.json(accessService.jwks);
});

app.post("/auth/login",
    [
        body("id").trim().notEmpty(),
        body("password").trim().notEmpty()
    ],
    async (req, res, next) => {
        try {
            const validation = validationResult(req);

            if (!validation.isEmpty()) {
                res.status(400).send("Invalid Input");
                return;
            }


            if (!await memberService.checkLogin(req.body.id, req.body.password)) {
                res.status(400).send("Login failed");
                return;
            }

            // 로그인 성공 시 로직
            const refreshToken = await refreshService.GenerateToken({
                rdk: v4() // 동일 시간에 의한 같은 토큰 반환 방지를 위한 랜덤 값
            });
            const accessToken = await accessService.GenerateToken({
                id: req.body.id
            }, iss, aud);

            await redisClient.set(req.body.id, refreshToken);

            res.cookie("refresh-token", refreshToken, {
                httpOnly: true,
                maxAge: dayof14,
                // https에서만 작동하게하는 쿠키
                secure: true,
                // 3-tier-architecture에서 samesite 사용 시 None 이외에는 쿠키가 전송되지 않는다
                sameSite: 'none'
            });

            res.json(accessToken);
        } catch (err) {
            next(err);
        }
    }
);

app.post("/auth/signup",
    [
        body("id").trim().notEmpty(),
        body("password").trim().notEmpty(),
        body("nickname").trim().notEmpty(),

    ],
    async (req, res, next) => {
        try {
            const validation = validationResult(req);

            if (!validation.isEmpty()) {
                res.status(400).send("Invalid Input");
                return;
            }

            await memberService.insertMember(req.body);

            res.send();
        } catch (err) {
            next(err);
        }
    }
);

app.get("/auth/check-id",
    [
        query("id").trim().notEmpty()
    ],
    (req, res, next) => {
        try {
            const validation = validationResult(req);

            if (!validation.isEmpty()) {
                res.status(400).send("Invalid Input");
                return;
            }
            const exist = memberService.checkIdExists(req.query.id);

            if (exist) {
                res.send("Not Exist");
            } else {
                res.send("Exist");
            }
        } catch (err) {
            next(err);
        }

    });

app.post("/auth/refresh", async (req, res, next) => {

    try {
        const token = req.cookies['refresh-token'];

        if (!token) {
            res.status(400).send("Token is not exist");
            return;
        }

        try {
            const refreshFromRedis = await redisClient.get(req.body.id);

            if (refreshFromRedis != token) {
                res.status(401).send("Token is not valid");
                return;
            }

            await refreshService.ValidateToken(token);
        } catch (err) {
            res.status(401).send("Token is not valid");
            return;
        }

        const refreshToken = await refreshService.GenerateToken({
            rdk: v4() // 동일 시간에 의한 같은 토큰 반환 방지를 위한 랜덤 값
        });
        const accessToken = await accessService.GenerateToken({
            id: req.body.id
        }, iss, aud);

        await redisClient.set(req.body.id, refreshToken);

        res.cookie("refresh-token", refreshToken, {
            httpOnly: true,
            maxAge: dayof14,
            // https에서만 작동하게하는 쿠키
            secure: true,
            // 3-tier-architecture에서 samesite 사용 시 None 이외에는 쿠키가 전송되지 않는다.
            sameSite: 'none'
        });

        res.json(accessToken);
    } catch (err) {
        next(err);
    }

});

app.delete("/auth/logout",
    [
        query("id").trim().notEmpty()
    ],
    async (req, res, next) => {
        try {
            const validation = validationResult(req);

            if (!validation.isEmpty()) {
                res.status(400).send("Invalid Input");
                return;
            }

            try {
                await accessService.ValidateToken(req.header("Authorization")?.split(" ")[1]);
                await redisClient.set(req.query.id, "");
            } catch {
                res.status(401).send("Token is not valid");
                return;
            }

            res.status(200).send();
        } catch (err) {
            next(err);
        }

    }
);

app.use((err, req, res, next) => {
    if (err.customCode === "DB Error") {
        console.log("DB Error : ", err);
        res.status(500).send();
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.log("Unexpected Error : ", err);
    res.status(500).send("Error occured");
});

const httpsOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    requestCert: false,
    rejectUnauthorized: false
};

const server = https.createServer(httpsOptions, app);

server.listen(port, () => {
    console.log("HTTPS server listening on port :" + port);
});