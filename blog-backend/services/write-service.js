import mysql from 'mysql2/promise';
import express from 'express';
import db from './db.js';
import { DateTime } from 'luxon';
import { v7 } from 'uuid';
import multer from 'multer';

import {body, query, validationResult} from 'express-validator';

const imagePath = "/article/images/";
const upload = multer({dest:"public"+imagePath});

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
            await conn.query("INSERT INTO article(article_id, blog_id, title, category_id, content, create_time, deleted) VALUES(?, ?, ?, ?, ?, ?, ?)",
                [v7(), req.body.blogId, req.body.title, req.body.category, req.body.content, DateTime.utc().toJSDate(), false]);
        });

        res.status(201).send();
    }
);

router.post("/image", upload.single("image"), (req, res)=>{
    res.send(imagePath+req.file.filename);
})

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
        query("articleId").trim().notEmpty()
    ],
    async (req, res)=>{
        const validation = validationResult(req);

        if(!validation.isEmpty()) {
            res.status(400).send("Request not valid");
            return;
        }

        await db.transactionQuery(async (conn)=>{
            await conn.query("UPDATE article SET deleted=TRUE WHERE article_id=?",
                [req.query.articleId]);
        });

        res.status(200).send();
    }
)

router.get("/category",
    [
        query("id").trim().notEmpty()
    ],
    async (req, res)=>{
        const validation = validationResult(req);

        if(!validation.isEmpty()) {
            res.status(400).send("Request not valid");
            return;
        }

        const category = await db.normalQuery(async (pool)=>{
            const [rows] = await pool.query("SELECT blog_id FROM blog WHERE id = ?", [req.query.id]);
            const [categories] = await pool.query("SELECT category_id, name FROM category WHERE blog_id = ?", [rows[0].blog_id]);
            return {
                blog_id: rows[0].blog_id,
                category: categories
            }
        });

        res.json(category);
    }
);

router.use((err, req, res, next)=>{
    console.log("Unexpected Error : ", err);
    res.status(500).send("Error occured");
});

export default router;