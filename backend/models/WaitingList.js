const mongoose = require('mongoose');

const waitingListSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', index: true },
  reason: { type: String },
  requestedAt: { type: Date, default: Date.now },
  notified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('WaitingList', waitingListSchema);
