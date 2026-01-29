const mysql = require('mysql2');

const requiredVars = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME'
];

requiredVars.forEach(v => {
  if (!process.env[v]) {
    throw new Error(`Missing required env var: ${v}`);
  }
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,   // MUST be "db"
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
