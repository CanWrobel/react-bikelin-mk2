const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Mongoose-Schema für Route
const routeSchema = new mongoose.Schema({
  startAddress: { type: String },
  startHouseNumber: { type: String },
  startPostalCode: { type: String },
  startPoint: { type: String }, // Format: "lat,lng"
  endAddress: { type: String },
  endHouseNumber: { type: String },
  endPostalCode: { type: String },
  endPoint: { type: String }, // Format: "lat,lng"
  description: { type: String },
  saveRoute: { type: Boolean, default: false },
  departureTime: { type: String }
}, {
  timestamps: true // createdAt, updatedAt
});

const RouteEntry = mongoose.model('RouteEntry', routeSchema, 'routes');

// GET /routes – alle abrufen
router.get('/', async (req, res) => {
    try {
      const data = await RouteEntry.find();
      const mappedRoutes = data.map(route => ({
        id: route._id,
        planningData: {
          startString: route.startAddress,
          endString: route.endAddress,
          routeDescription: route.description,
          departureTime: route.departureTime
        }
      }));
      res.json(mappedRoutes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// POST /routes – neue Route speichern
router.post('/', async (req, res) => {
    try {
      let body = req.body;
  
      // Transformiere alte Struktur in neues Format, falls notwendig
      if (body.startString && body.start && body.end) {
        body = {
          startAddress: body.startString,
          endAddress: body.endString,
          description: body.routeDescription,
          startPoint: `${body.start.lat},${body.start.lon}`,
          endPoint: `${body.end.lat},${body.end.lon}`,
          departureTime: body.departureTime,
          saveRoute: body.saveRoute,
          startHouseNumber: '',
          startPostalCode: '',
          endHouseNumber: '',
          endPostalCode: ''
        };
      }
  
      const route = new RouteEntry(body);
      await route.save();
      res.status(201).json(route);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

// GET /routes/:id – einzelne Route abrufen
router.get('/:id', async (req, res) => {
  try {
    const route = await RouteEntry.findById(req.params.id);
    if (!route) return res.status(404).json({ error: 'Nicht gefunden' });
    res.json(route);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /routes/:id – löschen
router.delete('/:id', async (req, res) => {
  try {
    const result = await RouteEntry.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Nicht gefunden' });
    res.json({ message: 'Gelöscht' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
