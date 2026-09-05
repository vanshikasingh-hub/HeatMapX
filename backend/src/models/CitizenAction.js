const mongoose = require('mongoose');

const CitizenActionSchema = new mongoose.Schema({
  userId: { type: String, default: "citizen_kanpur_demo" },
  citizenName: { type: String, default: "Aarav Sharma" },
  actionType: { 
    type: String, 
    required: true,
    enum: [
      'Planted Trees',
      'Maintained Urban Trees',
      'Created Rooftop Garden',
      'Installed Cool / Reflective Roof',
      'Used High-Albedo Reflective Paint',
      'Created Community Green Space',
      'Added Shading Structure',
      'Water Body Conservation',
      'Reported Heat Hotspot',
      'Organized Community Cooling Drive'
    ]
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  wardName: { type: String, default: "Kanpur Ward" },
  coordinates: {
    type: [Number], // [latitude, longitude]
    default: [26.4499, 80.3319]
  },
  date: { type: String, required: true },
  estimatedQuantity: { type: String, required: true },
  evidenceImage: { type: String, default: "" },
  impactCategory: {
    type: String,
    enum: ['Green Infrastructure', 'Cool Surface', 'Water Cooling', 'Community Awareness', 'Civic Reporting'],
    default: 'Green Infrastructure'
  },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Verified', 'Rejected'],
    default: 'Verified' // Default to Verified for demo purposes
  },
  impactPoints: { type: Number, default: 100 },
  verificationNotes: { type: String, default: "Prototype AI & Community verification check passed." }
}, { timestamps: true });

module.exports = mongoose.model('CitizenAction', CitizenActionSchema);
