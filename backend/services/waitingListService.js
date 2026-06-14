const WaitingList = require('../models/WaitingList');

exports.add = async (data) => new WaitingList(data).save();
exports.listByDoctor = async (doctorId) => WaitingList.find({ doctor: doctorId }).populate('patient');
exports.markNotified = async (id) => WaitingList.findByIdAndUpdate(id, { notified: true }, { new: true });
