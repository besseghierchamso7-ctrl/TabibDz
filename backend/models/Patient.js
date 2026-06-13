const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  birthDate: { type: Date },
  address: { type: String, trim: true, maxlength: 250 },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }]
}, { timestamps: true });

patientSchema.index({ user: 1 });

module.exports = mongoose.model('Patient', patientSchema);
