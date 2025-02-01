import express from 'express'; // package.json에서 type: module을 설정하면 가능하다.
import cookieParser from 'cookie-parser';
import {body, validationResult} from 'express-validator';
import { scheduleJob } from 'node-schedule';

import JwtService from './jwt.js';

const app = express();
const port = 8080;

const accessService = new JwtService("RS256", "1h");
const refreshService = new JwtService("RS256", "14d");

accessService.GenerateJwks();
refreshService.GenerateJwks();

// Jwks Rotation
const accessRotation = scheduleJob("0 0 0/4 * * *", ()=>{
    accessService.GenerateJwks();
})

const refreshRotation = scheduleJob("0 0 0 * * 1", ()=>{
    refreshService.GenerateJwks();
})

app.use(express.json());
app.use(cookieParser());

app.get("/auth/.well-known", (req, res)=>{
    res.json(accessService.jwks);
});

app.post("/auth/login",
    [
        body("id").trim().notEmpty(),
        body("password").trim().notEmpty()
    ], 
    (req, res)=>{
        const validation = validationResult(req);

        if(!validation.isEmpty()){
            res.status(400).send("Invalid Input");
        }

        const refreshToken = refreshService.GenerateToken();
        const accessToken = accessService.GenerateToken();

        res.cookie("refresh-token", refreshToken, {
            httpOnly: true,
            // https에서만 작동하게하는 쿠키, localhost 사용으로 인해 비활성화
            // secure: true
            // 3-tier-architecture에서 samesite 사용 시 None 이외에는 쿠키가 전송되지 않아 제거
        });

        res.send(accessToken);
    }
);

app.post("/auth/signup",
    [
        body("id").trim().notEmpty(),
        body("password").trim().notEmpty(),
        body("repeat").custom((value, { req }) => {
            return value === req.body.password;
        }),
        body("nickname").trim().notEmpty(),

    ],
    (req, res)=>{
        const validation = validationResult(req);

        if(!validation.isEmpty()){
            res.status(400).send("Invalid Input");
        }

        res.send();
    }
);

app.post("/auth/refresh", (req, res)=>{
    const token = req.cookies.refreshToken;

    if(!token) {
        res.send(400).send("Token is not exist");
    }
    try {
        refreshService.ValidateToken(req.token);
    } catch {
        res.send(401).send("Token is not valid");
    }

    // TODO : 기존 토큰을 Redis에 등록해 사용 불능으로 변경

    const refreshToken = refreshService.GenerateToken();
    const accessToken = accessService.GenerateToken();

    res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        // https에서만 작동하게하는 쿠키, localhost 사용으로 인해 비활성화
        // secure: true
        // 3-tier-architecture에서 samesite 사용 시 None 이외에는 쿠키가 전송되지 않아 제거
    });

    res.send(accessToken);
});

app.listen(port, ()=>{
    console.log("Server is Running : "+port);
});