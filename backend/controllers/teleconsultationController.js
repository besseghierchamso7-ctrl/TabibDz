const teleService = require('../services/teleconsultationService');

exports.create = async (req, res, next) => {
  try {
    const body = Object.assign({}, req.body, { patient: req.user?.id });
    const t = await teleService.create(body);
    res.status(201).json(t);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const t = await teleService.getById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.doctor) filter.doctor = req.query.doctor;
    if (req.query.patient) filter.patient = req.query.patient;
    const list = await teleService.list(filter);
    res.json(list);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await teleService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await teleService.remove(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
};
