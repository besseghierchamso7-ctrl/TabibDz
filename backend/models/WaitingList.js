const mongoose = require('mongoose');

const waitingListSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  specialty: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialty' },
  reason: { type: String },
  preferredDates: { type: [Date] },
  preferredTimes: { type: [String] },
  priority: { type: String, enum: ['normal', 'urgent'], default: 'normal' },
  status: { type: String, enum: ['active', 'offered', 'booked', 'expired', 'cancelled'], default: 'active' },
  requestedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  notificationChannels: { type: [String], enum: ['email', 'sms', 'whatsapp'], default: ['email'] },
  notified: { type: Boolean, default: false },
  notifiedAt: { type: Date },
  offeredAppointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  offeredAt: { type: Date },
  acceptedOffer: { type: Boolean },
  acceptedAt: { type: Date },
  notes: { type: String }
}, { timestamps: true });

waitingListSchema.index({ doctor: 1, status: 1 });
waitingListSchema.index({ patient: 1, status: 1 });
waitingListSchema.index({ expiresAt: 1 });
waitingListSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('WaitingList', waitingListSchema);
