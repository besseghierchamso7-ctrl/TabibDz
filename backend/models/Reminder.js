const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', index: true },
  remindAt: { type: Date, required: true, index: true },
  method: { type: String, enum: ['email','sms','push'], default: 'email' },
  sent: { type: Boolean, default: false },
  payload: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
