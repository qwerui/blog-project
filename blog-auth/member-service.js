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
            password: "blogmysql",
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
            console.log("DB Error : ", err);
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
            console.log("DB Error : ", err);
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
            await conn.query("INSERT INTO member VALUES(?, ?, ?)", [body.id, body.nickname, hashedPassword]);
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