const waitingService = require('../services/waitingListService');

exports.add = async (req, res, next) => {
  try {
    const data = Object.assign({}, req.body, { patient: req.user.id });
    const w = await waitingService.add(data);
    res.status(201).json(w);
  } catch (err) { next(err); }
};

exports.listByDoctor = async (req, res, next) => {
  try {
    const list = await waitingService.listByDoctor(req.params.doctorId);
    res.json(list);
  } catch (err) { next(err); }
};

exports.markNotified = async (req, res, next) => {
  try {
    const updated = await waitingService.markNotified(req.params.id);
    res.json(updated);
  } catch (err) { next(err); }
};
