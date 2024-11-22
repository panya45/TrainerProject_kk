import mysql from "mysql2/promise";

const db = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.db,
});
export default db;