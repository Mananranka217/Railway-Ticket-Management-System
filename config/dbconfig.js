const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  //(optional , default values: true ) waitForConnections: true,
  //(optional , default values: 10 ) connectionLimit: 10,
  //(optional , default values: 0 ) queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Connection to the database failed", err.message);
  } else {
    console.log(`Connected to the database:${process.env.DB_NAME}`);
    connection.release();
  }
});

module.exports = pool.promise();

