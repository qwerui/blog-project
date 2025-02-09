import mysql from 'mysql2/promise';
import express from 'express';
import db from './db.js';

import {body, query, validationResult} from 'express-validator';

const router = express.Router();

router.get("/public/blog/list",
    [
        query("blogId").trim().notEmpty(),
        query("categoryId").trim().notEmpty()
    ],
    async (req, res)=>{
        const validation = validationResult(req);

        if(!validation.isEmpty()) {
            res.status(400).send("Request not valid");
            return;
        }

        const page = req.query.page ? req.query.page : 0;

        const articleCount = await db.normalQuery(async (pool)=>{
            const [rows, fields] = await pool.query("SELECT COUNT(*) FROM article WHERE blog_id = ? AND deleted = FALSE", [req.query.blogId]);
            return rows[0];
        });

        const totalPage = (articleCount-1) / 10 + 1;

        const rows = await db.normalQuery(async (pool)=>{
            if(req.query.categoryId === "all") {
                const [rows, fields] = await pool.query(
                    "SELECT article_id, title, create_time, visit FROM article WHERE blog_id = ? AND deleted = FALSE ORDER BY create_time DESC LIMIT 10, ?",
                    [req.query.blogId, page * 10]);

                return rows;
            } else {
                const [rows, fields] = await pool.query(
                    "SELECT article_id, title, create_time, visit FROM article WHERE blog_id = ? AND deleted = FALSE AND category_id = ? ORDER BY create_time DESC LIMIT 10, ?",
                    [req.query.blogId, req.query.categoryId, page * 10]);

                return rows;
            }
        })

        const result = {
            totalPage: totalPage,
            articles: rows
        };

        res.json(result);
    }
);

router.get("/public/blog/article",
    [
        query("articleId").trim().notEmpty()
    ],
    async (req, res)=>{
        const validation = validationResult(req);

        if(!validation.isEmpty()) {
            res.status(400).send("Request not valid");
            return;
        }
        const article = await db.normalQuery(async (pool)=>{
            const [rows, fields] = pool.query("SELECT * FROM article WHERE article_id = ? AND deleted = FALSE", [req.query.articleId]);
            return rows[0];
        });

        res.json(article);
    }
);

router.get("public/blog/info",
    [
        query("blogId").trim().notEmpty()
    ],
    async (req, res)=>{
        const validation = validationResult(req);

        if(!validation.isEmpty()) {
            res.status(400).send("Request not valid");
            return;
        }

        const blog = await db.normalQuery(async (pool)=>{
            const [rows, fields] = pool.query("SELECT blog_id, title, description, image, nickname FROM blog b INNER JOIN member m ON b.id = m.id WHERE blog_id = ?", [req.query.blogId]);
            return rows[0];
        });

        const category = await db.normalQuery(async (pool)=>{
            const [rows, fields] = pool.query("SELECT category_id, name FROM category WHERE blog_id = ?", [req.query.blogId]);
            return rows;
        });

        blog.category = category;

        res.json(blog);
    }
);

export default router;