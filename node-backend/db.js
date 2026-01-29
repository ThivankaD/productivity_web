require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
  user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
  database: process.env.DB_NAME || process.env.MYSQL_DATABASE || 'productivity_hub',
  port: process.env.DB_PORT || process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();