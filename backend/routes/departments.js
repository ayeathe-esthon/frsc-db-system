const express = require('express');
const router = express.Router();
const { sql, config } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Departments');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Departments WHERE DepartmentID = @id');
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, requireAdmin, async (req, res) => {
  const { DepartmentName, ManagementLevel } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('DepartmentName', sql.VarChar, DepartmentName)
      .input('ManagementLevel', sql.VarChar, ManagementLevel)
      .query('INSERT INTO Departments (DepartmentName, ManagementLevel) VALUES (@DepartmentName, @ManagementLevel)');
    res.json({ message: 'Department created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { DepartmentName, ManagementLevel } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('DepartmentName', sql.VarChar, DepartmentName)
      .input('ManagementLevel', sql.VarChar, ManagementLevel)
      .input('id', sql.Int, req.params.id)
      .query('UPDATE Departments SET DepartmentName = @DepartmentName, ManagementLevel = @ManagementLevel WHERE DepartmentID = @id');
    res.json({ message: 'Department updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('UPDATE Staff SET DepartmentID = NULL WHERE DepartmentID = @id');
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Departments WHERE DepartmentID = @id');
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
