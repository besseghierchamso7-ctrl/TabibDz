const queueService = require('../services/queueService');

exports.get = async (req, res, next) => {
  try {
    const q = await queueService.getQueueForClinic(req.params.clinicId);
    res.json(q || { entries: [] });
  } catch (err) { next(err); }
};

exports.join = async (req, res, next) => {
  try {
    const entry = { patient: req.user.id, status: 'waiting', joinedAt: new Date(), meta: req.body.meta };
    const q = await queueService.addEntry(req.params.clinicId, entry);
    res.status(201).json(q);
  } catch (err) { next(err); }
};

exports.callNext = async (req, res, next) => {
  try {
    const next = await queueService.callNext(req.params.clinicId);
    if (!next) return res.status(404).json({ message: 'No waiting entries' });
    res.json(next);
  } catch (err) { next(err); }
};
