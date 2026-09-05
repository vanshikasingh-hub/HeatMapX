const mongoose = require('mongoose');

const ForecastSchema = new mongoose.Schema({
  locationId: { type: String, required: true },
  date: { type: String, required: true }, // e.g. "2026-08-30"
  dayLabel: { type: String, required: true }, // e.g. "Today", "Tomorrow", "Day 3"
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  heatIndex: { type: Number, required: true },
  hotspotIntensity: { type: String, enum: ['Low', 'Moderate', 'High', 'Severe'], default: 'Moderate' }
}, { timestamps: true });

module.exports = mongoose.model('Forecast', ForecastSchema);
