import mysql from 'mysql2/promise';
import express from 'express';
import db from './db';

import {body, query, validationResult} from 'express-validator';

const router = express.Router();

router.put("/config", 
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
            await db.transactionQuery(async (conn)=>{
                await conn.query(
                    "UPDATE blog SET title=?, description=?, image=? WHERE blog_id=?",
                    [,req.body.blogId]);

                await conn.query("DELETE FROM category WHERE blog_id = ?", [req.body.blogId]);
                const categories = req.body.categories.map(item, idx=>[req.body.blogId, idx, item]);
                await conn.query("INSERT INTO category(blog_id, category_id, name) VALUES ?", categories);
            })

            res.status(200).send();
        } catch {
            res.status(500).send("Error occured");
        }
    }
);

router.get("/config",
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
                const [rows, fields] = await pool.query("SELECT * FROM blog WHERE id=?", [req.body.id]);
                return rows;
            });
            res.json(config);
        } catch {
            res.status(500).send("Error occured");
        }
    }
);

export default router;