const mongoose = require('mongoose');

const queueEntrySchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  status: { type: String, enum: ['waiting','called','served','skipped'], default: 'waiting' },
  joinedAt: { type: Date, default: Date.now },
  meta: { type: Object }
}, { _id: false });

const queueSchema = new mongoose.Schema({
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', index: true },
  entries: { type: [queueEntrySchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Queue', queueSchema);
