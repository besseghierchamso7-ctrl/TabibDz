const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String },
  instructions: { type: String }
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  medications: { type: [medicationSchema], default: [] },
  issuedAt: { type: Date, default: Date.now },
  validUntil: { type: Date },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
