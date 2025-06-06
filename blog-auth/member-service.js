import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { v7 } from 'uuid';

const saltRounds = 10;

export default {
    pool: null,

    init() {
        this.pool = mysql.createPool({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "root",
            database: "blog"
        });
    },

    async transactionQuery(callback){
        const conn = await this.pool.getConnection();

        try {
            await conn.beginTransaction();
            const result = await callback(conn);
            await conn.commit();
            return result;
        } catch (err) {
            err.customCode = "DB Error";
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },
    async normalQuery(callback){
        try {
            return await callback(this.pool);
        } catch (err) {
            err.customCode = "DB Error";
            throw err;
        }
    },

    async checkIdExists(id) {
        return await this.normalQuery(async (pool)=>{
            const [results, fields] = await pool.query(
                "SELECT 1 FROM member WHERE id = ?",
                [id]
            );
    
            return results.length > 0;
        });
    },

    async insertMember(body) {

        const hashedPassword = await bcrypt.hash(body.password, saltRounds);

        await this.transactionQuery(async (conn)=>{
            const [results, fields] = await conn.query(
                "SELECT 1 FROM member WHERE id = ?",
                [body.id]);
            if(results.length > 0) {
                throw new Error("Member Already Exists");
            }
            await conn.query("INSERT INTO member(id, nickname, password) VALUES(?, ?, ?)", [body.id, body.nickname, hashedPassword]);
            await conn.query("INSERT INTO blog(blog_id, id) VALUES(?, ?)", [v7(), body.id]);
        });
    },

    async checkLogin(id, password) {
        return await this.normalQuery(async (pool)=>{
            const [results, fields] = await pool.query(
                "SELECT password FROM member WHERE id = ?",
                [id]
            );

            return await bcrypt.compare(password, results[0].password);
        });
    }
    
}