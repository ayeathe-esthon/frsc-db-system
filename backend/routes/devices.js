const express = require('express');
const router = express.Router();
const { sql, config } = require('../db');
const { verifyToken } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Devices');
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
      .query('SELECT * FROM Devices WHERE DeviceID = @id');
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const { DeviceName, SerialNumber, AssignedToStaffID, Status } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('DeviceName', sql.VarChar, DeviceName)
      .input('SerialNumber', sql.VarChar, SerialNumber)
      .input('AssignedToStaffID', sql.Int, AssignedToStaffID || null)
      .input('Status', sql.VarChar, Status || null)
      .query('INSERT INTO Devices (DeviceName, SerialNumber, AssignedToStaffID, Status) VALUES (@DeviceName, @SerialNumber, @AssignedToStaffID, @Status)');
    res.json({ message: 'Device created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const { DeviceName, SerialNumber, AssignedToStaffID, Status } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('DeviceName', sql.VarChar, DeviceName)
      .input('SerialNumber', sql.VarChar, SerialNumber)
      .input('AssignedToStaffID', sql.Int, AssignedToStaffID || null)
.input('Status', sql.VarChar, Status || null)
.input('id', sql.Int, req.params.id)
.query('UPDATE Devices SET DeviceName = @DeviceName, SerialNumber = @SerialNumber, AssignedToStaffID = @AssignedToStaffID, Status = @Status WHERE DeviceID = @id');
    res.json({ message: 'Device updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Devices WHERE DeviceID = @id');
    res.json({ message: 'Device deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
