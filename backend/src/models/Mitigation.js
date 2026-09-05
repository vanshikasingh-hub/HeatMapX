const mongoose = require('mongoose');

const MitigationSchema = new mongoose.Schema({
  mitigationId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true }, // Green Infrastructure, Cool Surface, Blue Infrastructure, Policy & Emergency
  description: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  expectedImpact: { type: String, required: true }, // e.g. "-2.5°C LST reduction"
  applicableConditions: { type: Array, default: [] }, // e.g. ["High NDBI", "Low NDVI"]
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'High', 'Complex'], default: 'Moderate' },
  costEstimate: { type: String, default: 'Medium' }
}, { timestamps: true });

module.exports = mongoose.model('Mitigation', MitigationSchema);
