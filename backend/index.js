const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./db');

const staffRoutes = require('./routes/staff');
const departmentRoutes = require('./routes/departments');
const deviceRoutes = require('./routes/devices');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/devices', deviceRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('FRSC Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});