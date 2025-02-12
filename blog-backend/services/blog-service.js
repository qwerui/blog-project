import mysql from 'mysql2/promise';
import express from 'express';
import db from './db.js';

import { body, oneOf, query, validationResult } from 'express-validator';

const router = express.Router();

router.get("/list",
    [
        query("id").trim().notEmpty(),
        oneOf([query("page").isEmpty(), query("page").isNumeric()]),
        oneOf([query("categoryId").isNumeric(), query("categoryId").isEmpty()])
    ],
    async (req, res, next) => {
        try {
            const validation = validationResult(req);

            if (!validation.isEmpty()) {
                res.status(400).send("Request not valid");
                return;
            }

            const page = req.query.page ? req.query.page : 0;

            const articleCount = await db.normalQuery(async (pool) => {
                if(req.query.categoryId == null){
                    const [rows, fields] = await pool.query(
                        "SELECT b.blog_id AS blog_id, COUNT(a.article_id) AS article_count "+
                        "FROM blog b LEFT OUTER JOIN article a ON a.blog_id = b.blog_id AND deleted = FALSE "+
                        "WHERE b.id = ? GROUP BY b.blog_id", [req.query.id]);
    
                    return rows[0];
                } else {
                    const [rows, fields] = await pool.query(
                        "SELECT b.blog_id AS blog_id, COUNT(a.article_id) AS article_count "+
                        "FROM blog b LEFT OUTER JOIN article a ON a.blog_id = b.blog_id AND a.category_id = ? AND deleted = FALSE "+
                        "WHERE b.id = ? GROUP BY b.blog_id", [req.query.categoryId, req.query.id]);
    
                    return rows[0];
                }
            });
            
            if (articleCount.article_count == 0) {
                res.status(404).send();
                return;
            }

            const blogId = articleCount.blog_id;
            const totalPage = (articleCount.article_count - 1) / 10 + 1;

            const rows = await db.normalQuery(async (pool) => {
                if (req.query.categoryId == null) {
                    const [rows, fields] = await pool.query(
                        "SELECT article_id, title, create_time, visit FROM article WHERE blog_id = ? AND deleted = FALSE ORDER BY create_time DESC LIMIT ?, 10",
                        [blogId, page * 10]);

                    return rows;
                } else {
                    const [rows, fields] = await pool.query(
                        "SELECT article_id, title, create_time, visit FROM article WHERE blog_id = ? AND deleted = FALSE AND category_id = ? ORDER BY create_time DESC LIMIT ?, 10",
                        [blogId, req.query.categoryId, page * 10]);

                    return rows;
                }
            });

            const result = {
                totalPage: totalPage,
                articles: rows
            };

            res.json(result);
        } catch (err) {
            next(err);
        }

    }
);

router.get("/article",
    [
        query("articleId").trim().notEmpty()
    ],
    async (req, res, next) => {
        try {
            const validation = validationResult(req);

            if (!validation.isEmpty()) {
                res.status(400).send("Request not valid");
                return;
            }

            const article = await db.normalQuery(async (pool) => {
                const [rows, fields] = await pool.query(
                    "SELECT a.content, a.create_time, a.title, b.id, c.name as category_name, c.category_id " +
                    "FROM article a INNER JOIN blog b ON a.blog_id = b.blog_id " +
                    "INNER JOIN category c ON c.blog_id = b.blog_id " +
                    "WHERE article_id = ? AND deleted = FALSE", [req.query.articleId]);
                return rows[0];
            });

            res.json(article);
        } catch (err) {
            next(err);
        }

    }
);

router.get("/info",
    [
        query("id").trim().notEmpty()
    ],
    async (req, res, next) => {
        try {
            const validation = validationResult(req);

            if (!validation.isEmpty()) {
                res.status(400).send("Request not valid");
                return;
            }

            const blog = await db.normalQuery(async (pool) => {
                const [rows, fields] = await pool.query("SELECT * FROM blog b INNER JOIN member m ON b.id = m.id WHERE m.id = ?", [req.query.id]);
                return rows[0];
            });

            const category = await db.normalQuery(async (pool) => {
                const [rows, fields] = await pool.query("SELECT category_id, name FROM category WHERE blog_id = ?", [blog.blog_id]);
                return rows;
            });

            blog.password = null;
            blog.category = category;

            res.json(blog);
        } catch (err) {
            next(err);
        }

    }
);

router.get("/search",
    [
        query("search").trim().notEmpty()
    ],
    async (req, res, next) => {
        try {
            const validation = validationResult(req);

            if (!validation.isEmpty()) {
                res.status(400).send("Request not valid");
                return;
            }

            const articles = await db.normalQuery(async (pool) => {
                const [rows] = await pool.query("SELECT a.article_id, b.id, a.create_time, a.title FROM article a INNER JOIN blog b WHERE a.title LIKE ? AND a.deleted = FALSE", [`%${req.query.search}%`]);
                return rows;
            });

            res.json(articles);
        } catch (err) {
            next(err);
        }

    }
)



export default router;