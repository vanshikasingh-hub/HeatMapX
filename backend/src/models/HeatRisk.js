const mongoose = require('mongoose');

const HeatRiskSchema = new mongoose.Schema({
  locationId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  riskScore: { type: Number, required: true }, // 0 to 100
  riskLevel: { type: String, enum: ['Very Low', 'Low', 'Moderate', 'High', 'Critical'], required: true },
  lst: { type: Number, required: true }, // Land Surface Temperature in °C
  airTemperature: { type: Number, required: true }, // Ambient air temp °C
  humidity: { type: Number, required: true }, // Relative Humidity %
  heatIndex: { type: Number, required: true }, // Heat index °C
  ndvi: { type: Number, required: true }, // Normalized Difference Vegetation Index (-1 to 1)
  ndbi: { type: Number, required: true }, // Normalized Difference Built-up Index (-1 to 1)
  smi: { type: Number, required: true }, // Soil Moisture Index (0 to 1)
  albedo: { type: Number, required: true }, // Surface Albedo (0 to 1)
  elevation: { type: Number, required: true }, // Elevation in meters
  populationDensity: { type: Number, required: true }, // People per sq km
  vulnerabilityScore: { type: Number, required: true }, // 0 to 100
  anthropogenicHeatProxy: { type: Number, default: 45 }
}, { timestamps: true });

module.exports = mongoose.model('HeatRisk', HeatRiskSchema);
