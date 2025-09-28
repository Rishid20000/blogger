const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);  

app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

const postRoutes = require("./routes/posts");

app.use("/", postRoutes);

const mongoose = require("mongoose");
const mysql = require("mysql2");

// MongoDB connection
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// MySQL initialization
const initMySQL = () => {
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

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  db.connect((err) => {
    if (err) {
      console.error("❌ MySQL connection error:", err);
    } else {
      console.log("✅ Connected to MySQL database");
      
      // Create users table
      db.query(createUsersTable, (err, result) => {
        if (err) {
          console.error("❌ Error creating users table:", err);
        } else {
          console.log("✅ Users table ready");
        }
        db.end();
      });
    }
  });
};

// Initialize MySQL when server starts
initMySQL();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
