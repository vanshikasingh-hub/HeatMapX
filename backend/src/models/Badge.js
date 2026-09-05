const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  requirement: { type: String, required: true },
  category: { type: String, required: true },
  targetCount: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Badge', BadgeSchema);
