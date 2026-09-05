const mongoose = require('mongoose');

const AwardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  requirement: { type: String, required: true },
  level: { type: String, required: true },
  badgeIcon: { type: String, default: "🏆" }
}, { timestamps: true });

module.exports = mongoose.model('Award', AwardSchema);
