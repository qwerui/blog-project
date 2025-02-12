import mysql from 'mysql2/promise';
import express from 'express';
import db from './db.js';
import path from 'path';
import multer from 'multer';

import { body, query, validationResult } from 'express-validator';

const imagePath = "/images/"

const router = express.Router();
const upload = multer({
    dest: "public" + imagePath, fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

router.put("/",
    upload.single("image"),
    [
        body("blogId").trim().notEmpty(),
        body("title").trim().notEmpty()
    ],
    async (req, res, next) => {
        try {
            const validation = validationResult(req);

            if (!validation.isEmpty()) {
                res.status(400).send("Request not valid");
                return;
            }


            await db.transactionQuery(async (conn) => {
                await conn.query(
                    "UPDATE blog SET title=?, description=? WHERE blog_id=?",
                    [req.body.title, req.body.description, req.body.blogId]);

                if (req.file != null) {
                    await conn.query(
                        "UPDATE blog SET image=? WHERE blog_id=?",
                        [imagePath + req.file.filename, req.body.blogId]
                    )
                }

                if (req.body.deleteCategory != null) {
                    await conn.query("DELETE FROM category WHERE blog_id = ? AND category_id IN (?)", [req.body.blogId, req.body.deleteCategory]);
                }

                if (req.body.newCategory != null) {
                    const newCategory = req.body.newCategory.map(item => [req.body.blogId, item]);
                    await conn.query("INSERT INTO category(blog_id, name) VALUES (?)", newCategory);
                }
            })

            res.status(200).send();
        } catch (err) {
            next(err);
        }
    }
);

router.get("/",
    [
        query("id").trim().notEmpty()
    ],
    async (req, res, next) => {
        try {
            if (!validation.isEmpty()) {
                res.status(400).send("Request not valid");
                return;
            }

            const config = await db.normalQuery(async (pool) => {
                const [rows, fields] = await pool.query("SELECT * FROM blog WHERE id=?", [req.query.id]);
                return rows[0];
            });
            const category = await db.normalQuery(async (pool) => {
                const [rows, fields] = await pool.query("SELECT category_id, name FROM category WHERE blog_id=?", [config.blog_id]);
                return rows;
            });
            config.category = category;
            res.json(config);
        } catch (err) {
            next(err);
        }
        const validation = validationResult(req);



    }
);

export default router;