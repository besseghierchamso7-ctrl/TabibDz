const mongoose = require('mongoose');

const openingHoursSchema = new mongoose.Schema({
  day: { type: String, required: true },
  open: { type: String },
  close: { type: String }
}, { _id: false });

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  wilaya: { type: mongoose.Schema.Types.ObjectId, ref: 'Wilaya', index: true },
  phone: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }
  },
  openingHours: { type: [openingHoursSchema], default: [] },
  specialties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Specialty' }],
  verified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Clinic', clinicSchema);
