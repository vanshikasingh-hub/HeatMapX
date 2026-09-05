const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// MongoDB Atlas connection if URI is set, with graceful fallback & 5s timeout
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.warn('⚠️ MongoDB connection timeout/error, operating with in-memory seeded dataset:', err.message));
} else {
  console.log('ℹ️ MONGODB_URI not provided. Operating with in-memory seeded Kanpur Nagar GeoJSON & Citizen Action dataset.');
}

// REST API Base Route
app.use('/api', apiRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: "healthy",
    name: "HeatMapX API Server",
    version: "2.0.0",
    description: "Urban Heat Intelligence & Citizen Climate Action Ecosystem for Kanpur Nagar, Uttar Pradesh, India",
    datasetStatus: "Demo / Simulated Dataset (Prototype Mode)",
    endpoints: [
      "/api/health",
      "/api/heatmap",
      "/api/locations",
      "/api/location/:id",
      "/api/forecast",
      "/api/environmental-factors",
      "/api/recommendations",
      "/api/simulation",
      "/api/routes",
      "/api/equity",
      "/api/citizen/actions",
      "/api/citizen/profile",
      "/api/citizen/badges",
      "/api/citizen/awards",
      "/api/leaderboard"
    ]
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`🚀 HeatMapX REST API Server running on http://localhost:${PORT}`);
  console.log(`📍 Primary Demonstration City: Kanpur Nagar, Uttar Pradesh, India`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use by another process.`);
  } else {
    console.error('❌ Server startup error:', err);
  }
});
