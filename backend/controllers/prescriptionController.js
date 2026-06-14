const prescriptionService = require('../services/prescriptionService');

exports.create = async (req, res, next) => {
  try {
    const body = Object.assign({}, req.body, { doctor: req.user.id });
    const p = await prescriptionService.create(body);
    res.status(201).json(p);
  } catch (err) { next(err); }
};

exports.listByPatient = async (req, res, next) => {
  try {
    const list = await prescriptionService.listByPatient(req.params.patientId);
    res.json(list);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const p = await prescriptionService.getById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) { next(err); }
};
