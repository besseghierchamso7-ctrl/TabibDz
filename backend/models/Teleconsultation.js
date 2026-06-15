const mongoose = require('mongoose');

const teleconsultationSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  roomName: { type: String, required: true, index: true },
  scheduledAt: { type: Date },
  status: { type: String, enum: ['scheduled','pending','in_progress','completed','cancelled'], default: 'scheduled' },
  recordingUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Teleconsultation', teleconsultationSchema);
