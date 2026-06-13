const mongoose = require('mongoose');

const wilayaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
  code: { type: Number, required: true, unique: true }
}, { timestamps: true });

wilayaSchema.index({ code: 1, name: 1 });

module.exports = mongoose.model('Wilaya', wilayaSchema);
