const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialty: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialty', required: true },
  wilaya: { type: mongoose.Schema.Types.ObjectId, ref: 'Wilaya', required: true },
  diploma: { type: String },
  photo: { type: String },
  bio: { type: String, maxlength: 1000 },
  address: { type: String },
  consultationPrice: { type: Number, required: true, min: 0 },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  availability: {
    // New format: days with time ranges
    monday: { enabled: { type: Boolean, default: false }, startTime: { type: String, default: '08:00' }, endTime: { type: String, default: '17:00' } },
    tuesday: { enabled: { type: Boolean, default: false }, startTime: { type: String, default: '08:00' }, endTime: { type: String, default: '17:00' } },
    wednesday: { enabled: { type: Boolean, default: false }, startTime: { type: String, default: '08:00' }, endTime: { type: String, default: '17:00' } },
    thursday: { enabled: { type: Boolean, default: false }, startTime: { type: String, default: '08:00' }, endTime: { type: String, default: '17:00' } },
    friday: { enabled: { type: Boolean, default: false }, startTime: { type: String, default: '08:00' }, endTime: { type: String, default: '17:00' } },
    saturday: { enabled: { type: Boolean, default: false }, startTime: { type: String, default: '08:00' }, endTime: { type: String, default: '17:00' } },
    sunday: { enabled: { type: Boolean, default: false }, startTime: { type: String, default: '08:00' }, endTime: { type: String, default: '17:00' } }
  },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

doctorSchema.index({ specialty: 1, wilaya: 1, rating: -1 });

module.exports = mongoose.model('Doctor', doctorSchema);
