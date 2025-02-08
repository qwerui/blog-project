import mysql from 'mysql2/promise';

export default {
    pool,

    init() {
        pool = mysql.createPool({
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
            return await callback(pool);
        } catch (err) {
            console.log("DB Error : ", err);
            throw err;
        }
    }
}