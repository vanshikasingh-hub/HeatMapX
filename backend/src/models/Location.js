const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  locationId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  wardName: { type: String, required: true },
  district: { type: String, default: 'Varanasi' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  geometry: {
    type: { type: String, enum: ['Polygon', 'MultiPolygon'], default: 'Polygon' },
    coordinates: { type: Array, required: true }
  },
  areaSqKm: { type: Number, default: 2.5 },
  metadata: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Location', LocationSchema);
