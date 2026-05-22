const express = require('express');
const router = express.Router();
const { sql, config } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// GET all staff
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Staff');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single staff
router.get('/:id', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Staff WHERE StaffID = @id');
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create staff
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  const { FirstName, LastName, Email, Phone, DepartmentID } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('FirstName', sql.VarChar, FirstName)
      .input('LastName', sql.VarChar, LastName)
      .input('Email', sql.VarChar, Email)
      .input('Phone', sql.VarChar, Phone)
      .input('DepartmentID', sql.Int, DepartmentID)
      .query('INSERT INTO Staff (FirstName, LastName, Email, Phone, DepartmentID) VALUES (@FirstName, @LastName, @Email, @Phone, @DepartmentID)');
    res.json({ message: 'Staff created successfully' });
  } catch (err) {
    console.log('POST error:', err.message)
    res.status(500).json({ error: err.message });
  }
});

// PUT update staff
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { FirstName, LastName, Email, Phone, DepartmentID } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('FirstName', sql.VarChar, FirstName)
      .input('LastName', sql.VarChar, LastName)
      .input('Email', sql.VarChar, Email)
      .input('Phone', sql.VarChar, Phone)
      .input('DepartmentID', sql.Int, DepartmentID)
      .input('id', sql.Int, req.params.id)
      .query('UPDATE Staff SET FirstName = @FirstName, LastName = @LastName, Email = @Email, Phone = @Phone, DepartmentID = @DepartmentID WHERE StaffID = @id');
    res.json({ message: 'Staff updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE staff
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    console.log('Deleting staff with ID:', req.params.id);
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('UPDATE Devices SET AssignedToStaffID = NULL WHERE AssignedToStaffID = @id');
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Staff WHERE StaffID = @id');
    res.json({ message: 'Staff deleted successfully' });
  } catch (err) {
    console.log('Delete error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
