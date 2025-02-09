const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost', // MySQLホスト名
    user: 'root', // MySQLユーザー名
    password: 'Youi0819@', // MySQLのパスワード
    database: 'progress', // 使用するデータベース名
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
