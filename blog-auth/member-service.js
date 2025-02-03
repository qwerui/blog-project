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
            await callback(conn);
            await conn.commit();
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
            return await callback();
        } catch (err) {
            console.log("DB Error : ", err);
            throw err;
        }
    },

    async checkIdExists(id) {
        return await this.normalQuery(async ()=>{
            const [results, fields] = await this.pool.query(
                "SELECT 1 FROM member WHERE id = ?",
                [id]
            );
    
            return results.length;
        });
    },

    async insertMember(body) {
        await this.transactionQuery(async (conn)=>{
            await conn.query("INSERT INTO member VALUES(?, ?, ?)", [body.id, body.password, body.nickname]);
        });
    },

    async checkLogin(id, password) {
        return await this.normalQuery(async ()=>{
            const [results, fields] = await this.pool.query(
                "SELECT password FROM member WHERE id = ?",
                [id]
            );

            return results[0].password == password;
        });
    }
    
}