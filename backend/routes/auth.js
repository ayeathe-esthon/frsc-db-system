const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { sql, config } = require('../db');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE Username = @username');

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.Password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userID: user.UserID, username: user.Username, role: user.Role },
      'frsc_secret_key',
      { expiresIn: '8h' }
    );

    res.json({ token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/change-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userID = req.user.userID;

  try {
    const pool = await sql.connect(config);

    // Get current user record
    const result = await pool.request()
      .input('userID', sql.Int, userID)
      .query('SELECT * FROM Users WHERE UserID = @userID');

    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.Password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNew = await bcrypt.hash(newPassword, 10);

    // Update in database
    await pool.request()
      .input('hashedNew', sql.NVarChar, hashedNew)
      .input('userID', sql.Int, userID)
      .query('UPDATE Users SET Password = @hashedNew WHERE UserID = @userID');

    res.json({ message: 'Password changed successfully' });

  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;