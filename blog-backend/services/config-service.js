import mysql from 'mysql2/promise';
import express from 'express';
import db from './db.js';
import path from 'path';

import {body, query, validationResult} from 'express-validator';

const router = express.Router();

router.put("/", 
    [
        body("blogId").trim().notEmpty(),
        body("title").trim().notEmpty()
    ],
    async (req, res)=>{
        const validation = validationResult(req);

        if(!validation.isEmpty()) {
            res.status(400).send("Request not valid");
            return;
        }

        try {
            // await db.transactionQuery(async (conn)=>{
            //     await conn.query(
            //         "UPDATE blog SET title=?, description=?, image=? WHERE blog_id=?",
            //         [req.body.title, req.body.description, , req.body.blogId]);

            //     await conn.query("DELETE FROM category WHERE blog_id = ?", [req.body.blogId]);
            //     const categories = req.body.categories.map(item, idx=>[req.body.blogId, idx, item]);
            //     await conn.query("INSERT INTO category(blog_id, category_id, name) VALUES ?", categories);
            // })

            res.status(200).send();
        } catch {
            res.status(500).send("Error occured");
        }
    }
);

router.get("/",
    [
        query("id").trim().notEmpty()
    ],
    async (req, res)=>{
        const validation = validationResult(req);

        if(!validation.isEmpty()) {
            res.status(400).send("Request not valid");
            return;
        }
        try {
            const config = await db.normalQuery(async (pool)=>{
                const [rows, fields] = await pool.query("SELECT * FROM blog WHERE id=?", [req.query.id]);
                return rows;
            });
            const category = await db.normalQuery(async (pool)=>{
                const [rows, fields] = await pool.query("SELECT category_id, name FROM category WHERE blog_id=?", [config.blog_id]);
                return rows;
            });
            config.category = category;
            res.json(config);
        } catch {
            res.status(500).send("Error occured");
        }
    }
);

export default router;