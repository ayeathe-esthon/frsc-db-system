const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 1433,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    trustServerCertificate: true,
    encrypt: false,
    enableArithAbort: true,
  }
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log('Connected to MSSQL successfully!');
  } catch (err) {
    console.log('Database connection failed:', err.message);
  }
};

module.exports = { sql, connectDB, config };
