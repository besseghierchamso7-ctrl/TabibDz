const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Specialty = require('../models/Specialty');
const Wilaya = require('../models/Wilaya');

const requestDoctorRegistration = async (userId, data) => {
  const doctorExists = await Doctor.findOne({ user: userId });
  if (doctorExists) {
    throw new Error('Doctor profile already exists');
  }
  const doctor = await Doctor.create({ user: userId, ...data });
  return doctor;
};

const getDoctors = async (filters, pagination = {}) => {
  const query = { status: 'verified' };
  if (filters.wilaya) query.wilaya = filters.wilaya;
  if (filters.specialty) query.specialty = filters.specialty;
  if (filters.gender) query.gender = filters.gender;
  if (filters.rating) query.rating = { $gte: Number(filters.rating) };
  const doctors = await Doctor.find(query)
    .populate('user', 'firstName lastName email phone avatar')
    .populate('specialty')
    .populate('wilaya')
    .sort({ rating: -1 })
    .skip(pagination.skip || 0)
    .limit(pagination.limit || 20);
  return doctors;
};

const getDoctorById = async (doctorId) => {
  return Doctor.findById(doctorId)
    .populate('user', 'firstName lastName email phone avatar bio gender')
    .populate('specialty')
    .populate('wilaya');
};

const updateDoctorProfile = async (doctorId, data) => {
  return Doctor.findByIdAndUpdate(doctorId, data, { new: true, runValidators: true });
};

const verifyDoctor = async (doctorId, status) => {
  return Doctor.findByIdAndUpdate(doctorId, { status }, { new: true });
};

const getTopDoctors = async () => {
  return Doctor.find({ status: 'verified' }).sort({ rating: -1 }).limit(6).populate('user specialty wilaya');
};

module.exports = { requestDoctorRegistration, getDoctors, getDoctorById, updateDoctorProfile, verifyDoctor, getTopDoctors };
