const sql = require('mssql');
require('dotenv').config();

const config = {
  server: 'localhost',
  database: 'frsc_db',
  port: 1433,
  user: 'frscadmin',
  password: 'Admin1234!',
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