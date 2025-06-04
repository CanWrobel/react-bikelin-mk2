const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB-Verbindung
mongoose.connect('mongodb+srv://canwrob:mopsmopsmops@cluster0.tv4rxwp.mongodb.net/BIKELIN', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routen
const incidentsRoute = require('./incidents.cjs');
app.use('/incidents', incidentsRoute);
const routesRoute = require('./routes.cjs');
app.use('/routes', routesRoute);

// Server starten
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server läuft unter http://localhost:${PORT}`);
});
