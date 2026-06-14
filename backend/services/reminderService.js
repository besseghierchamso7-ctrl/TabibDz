const Reminder = require('../models/Reminder');

exports.create = async (data) => new Reminder(data).save();
exports.listPending = async (before) => Reminder.find({ sent: false, remindAt: { $lte: before } }).populate('user appointment');
exports.markSent = async (id) => Reminder.findByIdAndUpdate(id, { sent: true }, { new: true });
