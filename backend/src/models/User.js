const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['analyst', 'planner', 'admin', 'citizen'], default: 'citizen' },
  points: { type: Number, default: 1240 },
  level: { type: String, default: "Level 5 — Climate Champion" },
  badges: [{ type: String }],
  awards: [{ type: String }],
  savedAnalyses: [{ type: Object }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
