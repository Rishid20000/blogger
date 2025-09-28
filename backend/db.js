const mysql = require("mysql2");

// Use MYSQL_URL if available, otherwise use individual variables
const dbConfig = process.env.MYSQL_URL ? 
  process.env.MYSQL_URL : 
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  };

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error("DB connection error:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;
