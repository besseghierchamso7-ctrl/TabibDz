const mongoose = require('mongoose');

const specialtySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500 }
}, { timestamps: true });

module.exports = mongoose.model('Specialty', specialtySchema);
