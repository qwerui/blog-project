import mysql from 'mysql2/promise';

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
            await conn.rollback();
            err.customCode = "DB Error";
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
    }
}