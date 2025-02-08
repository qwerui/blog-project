import mysql from 'mysql2/promise';
import express from 'express';
import db from './db';
import { DateTime } from 'luxon';
import { v7 } from 'uuid';

import {body, query, validationResult} from 'express-validator';

const router = express.Router();

router.post("/",
    [
        body("blogId").trim().notEmpty(),
        body("title").trim().notEmpty(),
        body("category").trim().notEmpty(),
        body("content").notEmpty()
    ],
    async (req, res)=>{
        const validation = validationResult(req);

        if(!validation.isEmpty()) {
            res.status(400).send("Request not valid");
            return;
        }

        await db.transactionQuery(async (conn)=>{
            await conn.query("INSERT INTO article(article_id, blog_id, title, category_id, content, visit, create_time) VALUES(?, ?, ?, ?, ?, ?)",
                [v7(), req.body.blogId, req.body.title, req.body.category, req.body.content, 0, DateTime.utc()]);
        });

        res.status(201).send();
    }
);

router.put("/",
    [
        body("articleId").trim().notEmpty(),
        body("title").trim().notEmpty(),
        body("category").trim().notEmpty(),
        body("content").notEmpty()
    ],
    async (req, res)=>{
        const validation = validationResult(req);

        if(!validation.isEmpty()) {
            res.status(400).send("Request not valid");
            return;
        }

        await db.transactionQuery(async (conn)=>{
            await conn.query("UPDATE article SET title=?, category_id=?, content=? WHERE article_id=?",
                [req.body.title, req.body.category, req.body.content, req.body.articleId]);
        });

        res.status(200).send();
    }
)

router.delete("/",
    [
        body("articleId").trim().notEmpty()
    ],
    async (req, res)=>{
        const validation = validationResult(req);

        if(!validation.isEmpty()) {
            res.status(400).send("Request not valid");
            return;
        }

        await db.transactionQuery(async (conn)=>{
            await conn.query("UPDATE article SET deleted=TRUE WHERE article_id=?",
                [req.body.articleId]);
        });

        res.status(200).send();
    }
)

export default router;