const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Mongoose-Schema passend zu deinem Frontend-Type
const incidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  description: { type: String },
  date: { type: String },
  time: { type: String },
  category: { type: String },
  timeCategory: { type: String },
  street: { type: String },
  zip: { type: Number },
  city: { type: String },
  username: { type: String },
  image: { type: String },
  incident_id: { type: Number },
  dangerLevel: { type: String, required: true }
}, {
  timestamps: true // erstellt createdAt und updatedAt automatisch
});

const Incident = mongoose.model('Incident', incidentSchema, 'incidents');

// GET /incidents – alle abrufen
router.get('/', async (req, res) => {
  try {
    const data = await Incident.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /incidents – neuen Incident speichern
router.post('/', async (req, res) => {
  try {
    const incident = new Incident(req.body);
    await incident.save();
    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /incidents/:id – einen einzelnen Incident abrufen
router.get('/:id', async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ error: 'Nicht gefunden' });
    res.json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /incidents/:id – löschen
router.delete('/:id', async (req, res) => {
  try {
    const result = await Incident.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Nicht gefunden' });
    res.json({ message: 'Gelöscht' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
