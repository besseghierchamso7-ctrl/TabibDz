const Clinic = require('../models/Clinic');

exports.createClinic = async (data) => {
  const clinic = new Clinic(data);
  return clinic.save();
};

exports.getClinicById = async (id) => Clinic.findById(id).populate('wilaya specialties');

exports.listClinics = async (filter = {}, options = {}) => {
  const q = Clinic.find(filter).populate('wilaya specialties');
  if (options.limit) q.limit(options.limit);
  if (options.skip) q.skip(options.skip);
  return q.exec();
};

exports.updateClinic = async (id, data) => Clinic.findByIdAndUpdate(id, data, { new: true });

exports.deleteClinic = async (id) => Clinic.findByIdAndDelete(id);
