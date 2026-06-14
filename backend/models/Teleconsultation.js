const mongoose = require('mongoose');

const teleconsultSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  scheduledAt: { type: Date, required: true, index: true },
  durationMinutes: { type: Number, default: 20 },
  joinUrl: { type: String },
  status: { type: String, enum: ['pending','confirmed','cancelled','completed','missed'], default: 'pending' },
  price: { type: Number },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Teleconsultation', teleconsultSchema);
