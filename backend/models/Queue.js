const mongoose = require('mongoose');

const queueEntrySchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  queueNumber: { type: Number, required: true },
  priority: { type: String, enum: ['normal', 'urgent', 'vip'], default: 'normal' },
  status: { type: String, enum: ['waiting', 'called', 'served', 'skipped', 'no-show', 'cancelled'], default: 'waiting' },
  joinedAt: { type: Date, default: Date.now },
  calledAt: { type: Date },
  servedAt: { type: Date },
  estimatedWaitTime: { type: Number },
  actualWaitTime: { type: Number },
  notes: { type: String }
}, { _id: true });

const queueSchema = new mongoose.Schema({
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  date: { type: Date, required: true, index: true },
  currentNumber: { type: Number, default: 0 },
  maxCapacity: { type: Number, default: 50 },
  entries: { type: [queueEntrySchema], default: [] },
  status: { type: String, enum: ['open', 'paused', 'closed'], default: 'open' },
  totalServed: { type: Number, default: 0 },
  totalNoShow: { type: Number, default: 0 },
  totalSkipped: { type: Number, default: 0 }
}, { timestamps: true });

queueSchema.index({ clinic: 1, date: 1 });
queueSchema.index({ doctor: 1, date: 1 });

queueSchema.methods.getNextQueueNumber = function() {
  return this.entries.length > 0 ? Math.max(...this.entries.map(e => e.queueNumber)) + 1 : 1;
};

queueSchema.methods.getPatientPosition = function(patientId) {
  const entry = this.entries.find(e => e.patient.toString() === patientId.toString() && e.status !== 'cancelled');
  if (!entry) return -1;
  return this.entries.filter(e => {
    return e.joinedAt <= entry.joinedAt && (e.status === 'waiting' || e.status === 'called') && e.patient.toString() !== patientId.toString();
  }).length + 1;
};

queueSchema.methods.getEstimatedWaitTime = function(position) {
  const avgTimePerPatient = 15;
  return Math.max(0, (position - 1) * avgTimePerPatient);
};

module.exports = mongoose.model('Queue', queueSchema);
