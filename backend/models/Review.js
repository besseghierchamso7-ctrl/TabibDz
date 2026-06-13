const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 1000 },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }
}, { timestamps: true });

reviewSchema.index({ doctor: 1, patient: 1 });

module.exports = mongoose.model('Review', reviewSchema);
