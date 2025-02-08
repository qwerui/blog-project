import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as jose from 'jose';

import db from "./services/db";

import configRouter from './services/config-service';
import writeRouter from './services/write-service';
import blogRouter from './services/blog-service';

db.init();

const app = express();
const port = 8080;

const jwkUrl = "http://localhost:8081";
const iss = "http://blog-auth";
const aud = "http://blog-service";

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/secure", async (req, res, next) => {
    const jwt = req.body.accessToken;

    if(!jwt) {
        res.status(401).send("Token is not exist");
        return;
    }

    const jwks = jose.createRemoteJWKSet(new URL(jwkUrl));

    const { payload, protectedHeader } = await jose.jwtVerify(jwt, jwks, {
        issuer: iss,
        audience: aud,
    });

    if(req.body.id === payload.id) {
        next();
    } else {
        res.status(400).send("Invalid Request");
    }
});

app.use("/api", blogRouter);
app.use("/api/secure/config", configRouter);
app.use("/api/secure/write", writeRouter);

app.use((err, req, res, next)=>{
    console.log("Unexpected Error : ", err);
    res.status(500).send("Error occured");
});

app.listen(port, () => {
    console.log("Server is Running : " + port);
});