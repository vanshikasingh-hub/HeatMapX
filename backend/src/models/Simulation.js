const mongoose = require('mongoose');

const SimulationSchema = new mongoose.Schema({
  locationId: { type: String, required: true },
  scenarioParameters: {
    treeCoverIncreasePct: { type: Number, default: 0 },
    albedoIncreasePct: { type: Number, default: 0 },
    coolRoofCoveragePct: { type: Number, default: 0 },
    greenRoofCoveragePct: { type: Number, default: 0 },
    waterFeatureAddition: { type: Boolean, default: false },
    builtUpReductionPct: { type: Number, default: 0 }
  },
  baseline: {
    riskScore: Number,
    lst: Number,
    ndvi: Number,
    albedo: Number,
    heatIndex: Number
  },
  simulatedResult: {
    simulatedRiskScore: Number,
    simulatedLst: Number,
    simulatedNdvi: Number,
    simulatedAlbedo: Number,
    lstReductionDelta: Number,
    riskScoreDelta: Number,
    populationBenefitedEstimate: Number
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Simulation', SimulationSchema);
