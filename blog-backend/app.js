import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as jose from 'jose';
import https from 'https';
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

import db from "./services/db.js";

import configRouter from './services/config-service.js';
import writeRouter from './services/write-service.js';
import blogRouter from './services/blog-service.js';

db.init();

const app = express();
const port = 8080;

const jwkUrl = "https://localhost:8081/auth/.well-known";
const iss = "http://blog-auth";
const aud = "http://blog-service";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({
    origin: "https://localhost:3000",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(async (req, res, next) => {
    if(req.method == "GET" || req.method == "OPTION"){
        next();
        return;
    }

    const jwt = req.header("Authorization");

    if(!jwt) {
        res.status(401).send("Token is not exist");
        return;
    }

    const jwks = jose.createRemoteJWKSet(new URL(jwkUrl));

    try {
        await jose.jwtVerify(jwt, jwks, {
            issuer: iss,
            audience: aud,
        });
    } catch {
        res.status(401).send("Token is not Valid");
    }

    next();
});

app.use("/api/blog", blogRouter);
app.use("/api/config", configRouter);
app.use("/api/write", writeRouter);

app.use((err, req, res, next)=>{
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