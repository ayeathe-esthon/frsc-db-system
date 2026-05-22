// backend/routes/dashboard.js

const express = require("express");
const router = express.Router();
const { sql, config } = require("../db"); // ← import sql and config, not a pool

router.get("/", async (req, res) => {
  try {
    const pool = await sql.connect(config); // ← create the connection here, just like your other routes

    const result = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM Staff) AS totalStaff,
        (SELECT COUNT(*) FROM Departments) AS totalDepartments,
        (SELECT COUNT(*) FROM Devices) AS totalDevices,
        (SELECT COUNT(*) FROM Devices WHERE Status = 'Active') AS activeDevices,
        (SELECT COUNT(*) FROM Devices WHERE Status = 'Under Maintenance') AS maintenanceDevices,
        (SELECT COUNT(*) FROM Devices WHERE Status = 'Decommissioned') AS decommissionedDevices
    `);

    const recentStaff = await pool.request().query(`
  SELECT TOP 5 StaffID, FirstName, LastName, Email
  FROM Staff
  ORDER BY StaffID DESC
`);

    res.json({
      stats: result.recordset[0],
      recentStaff: recentStaff.recordset,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
});

module.exports = router;