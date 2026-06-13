const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  scheduledAt: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  reason: { type: String, trim: true, maxlength: 1000 },
  price: { type: Number, required: true, min: 0 },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  completedAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

appointmentSchema.index({ doctor: 1, patient: 1, scheduledAt: 1, status: 1 });
appointmentSchema.index({ scheduledAt: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
