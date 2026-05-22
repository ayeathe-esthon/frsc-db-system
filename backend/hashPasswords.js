const bcrypt = require('bcryptjs');
const { sql, config } = require('./db');

async function hashExistingPasswords() {
  try {
    const pool = await sql.connect(config);
    
    // Get all users
    const result = await pool.request().query('SELECT UserID, Password FROM Users');
    const users = result.recordset;

    for (const user of users) {
      // Hash the plain text password
      const hashed = await bcrypt.hash(user.Password, 10);
      
      // Update it in the database
      await pool.request()
        .input('hashed', sql.NVarChar, hashed)
        .input('id', sql.Int, user.UserID)
        .query('UPDATE Users SET Password = @hashed WHERE UserID = @id');
      
      console.log(`Hashed password for UserID ${user.UserID}`);
    }

    console.log('All passwords hashed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

hashExistingPasswords();