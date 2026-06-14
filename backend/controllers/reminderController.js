const reminderService = require('../services/reminderService');

exports.create = async (req, res, next) => {
  try {
    const data = Object.assign({}, req.body, { user: req.user.id });
    const r = await reminderService.create(data);
    res.status(201).json(r);
  } catch (err) { next(err); }
};

exports.listPending = async (req, res, next) => {
  try {
    const before = req.query.before ? new Date(req.query.before) : new Date();
    const list = await reminderService.listPending(before);
    res.json(list);
  } catch (err) { next(err); }
};

exports.markSent = async (req, res, next) => {
  try {
    const updated = await reminderService.markSent(req.params.id);
    res.json(updated);
  } catch (err) { next(err); }
};
