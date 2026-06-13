const Patient = require('../models/Patient');
const User = require('../models/User');
const Notification = require('../models/Notification');

const getPatientProfile = async (userId) => {
  return Patient.findOne({ user: userId }).populate('user favorites notifications').lean();
};

const createPatientProfile = async (userId) => {
  const existing = await Patient.findOne({ user: userId });
  if (existing) throw new Error('Profile already exists');
  return Patient.create({ user: userId });
};

const updatePatientProfile = async (patientId, data) => {
  return Patient.findByIdAndUpdate(patientId, data, { new: true, runValidators: true });
};

const addFavoriteDoctor = async (patientId, doctorId) => {
  return Patient.findByIdAndUpdate(patientId, { $addToSet: { favorites: doctorId } }, { new: true }).populate('favorites');
};

const removeFavoriteDoctor = async (patientId, doctorId) => {
  return Patient.findByIdAndUpdate(patientId, { $pull: { favorites: doctorId } }, { new: true }).populate('favorites');
};

const getNotifications = async (userId) => {
  return Notification.find({ user: userId }).sort({ createdAt: -1 });
};

const markNotificationRead = async (notificationId) => {
  return Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
};

module.exports = { getPatientProfile, createPatientProfile, updatePatientProfile, addFavoriteDoctor, removeFavoriteDoctor, getNotifications, markNotificationRead };
