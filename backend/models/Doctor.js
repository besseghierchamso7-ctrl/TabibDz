const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialty: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialty', required: true },
  wilaya: { type: mongoose.Schema.Types.ObjectId, ref: 'Wilaya', required: true },
  diploma: { type: String },
  photo: { type: String },
  bio: { type: String, maxlength: 1000 },
  consultationPrice: { type: Number, required: true, min: 0 },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  availability: {
    days: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
    timeSlots: [{ type: String }]
  },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

doctorSchema.index({ specialty: 1, wilaya: 1, rating: -1 });

module.exports = mongoose.model('Doctor', doctorSchema);
