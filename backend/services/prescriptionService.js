const Prescription = require('../models/Prescription');

exports.create = async (data) => new Prescription(data).save();
exports.listByPatient = async (patientId) => Prescription.find({ patient: patientId }).populate('doctor');
exports.getById = async (id) => Prescription.findById(id).populate('doctor patient');
