const clinicService = require('../services/clinicService');

exports.createClinic = async (req, res, next) => {
  try {
    const clinic = await clinicService.createClinic(req.body);
    res.status(201).json(clinic);
  } catch (err) { next(err); }
};

exports.getClinic = async (req, res, next) => {
  try {
    const clinic = await clinicService.getClinicById(req.params.id);
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
    res.json(clinic);
  } catch (err) { next(err); }
};

exports.listClinics = async (req, res, next) => {
  try {
    const clinics = await clinicService.listClinics(req.query);
    res.json(clinics);
  } catch (err) { next(err); }
};

exports.updateClinic = async (req, res, next) => {
  try {
    const clinic = await clinicService.updateClinic(req.params.id, req.body);
    res.json(clinic);
  } catch (err) { next(err); }
};

exports.deleteClinic = async (req, res, next) => {
  try {
    await clinicService.deleteClinic(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
};
