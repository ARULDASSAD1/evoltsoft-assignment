const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB (free cloud database)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.error("MongoDB Error:", err));

// Charging Station Model
const Charger = mongoose.model('Charger', {
  name: String,
  location: { lat: Number, lng: Number },
  status: { type: String, default: 'Active' },
  powerOutput: Number,
  connectorType: String
});

// Test Route
app.get('/', (req, res) => {
  res.send("Backend is working!");
});

// CRUD Routes (simplified)
app.get('/chargers', async (req, res) => {
  const chargers = await Charger.find();
  res.json(chargers);
});

app.post('/chargers', async (req, res) => {
  const charger = new Charger(req.body);
  await charger.save();
  res.status(201).send(charger);
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});