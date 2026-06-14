const Teleconsultation = require('../models/Teleconsultation');

exports.create = async (data) => new Teleconsultation(data).save();
exports.getById = async (id) => Teleconsultation.findById(id).populate('patient doctor');
exports.list = async (filter = {}) => Teleconsultation.find(filter).populate('patient doctor').sort({ scheduledAt: 1 });
exports.update = async (id, data) => Teleconsultation.findByIdAndUpdate(id, data, { new: true });
exports.remove = async (id) => Teleconsultation.findByIdAndDelete(id);
