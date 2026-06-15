const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');
const Specialty = require('../models/Specialty');
const Wilaya = require('../models/Wilaya');

const getDashboardStats = async () => {
  const doctorsCount = await Doctor.countDocuments();
  const patientsCount = await User.countDocuments({ role: 'patient' });
  const appointmentsCount = await Appointment.countDocuments();
  const confirmedCount = await Appointment.countDocuments({ status: 'confirmed' });
  const pendingCount = await Appointment.countDocuments({ status: 'pending' });
  const revenue = await Appointment.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$price' } } }
  ]);
  const reviewsCount = await Review.countDocuments();
  return {
    doctorsCount,
    patientsCount,
    appointmentsCount,
    confirmedCount,
    pendingCount,
    revenue: revenue[0]?.total || 0,
    reviewsCount
  };
};

const manageSpecialty = async (data) => {
  return Specialty.create(data);
};

const manageWilaya = async (data) => {
  return Wilaya.create(data);
};

const listUsers = async (role) => {
  return User.find(role ? { role } : {}).select('-password').lean();
};

const listDoctorsAdmin = async () => {
  return Doctor.find().populate('user specialty wilaya');
};

const listAppointmentsAdmin = async () => {
  return Appointment.find()
    .populate({ path: 'patient', populate: { path: 'user', select: 'firstName lastName' } })
    .populate({
      path: 'doctor',
      populate: [
        { path: 'user', select: 'firstName lastName' },
        { path: 'specialty', select: 'name' },
        { path: 'wilaya', select: 'name' }
      ]
    });
};

const listReviewsAdmin = async () => {
  return Review.find().populate('patient doctor');
};

const listSpecialties = async () => {
  return Specialty.find().sort({ name: 1 });
};

const listWilayas = async () => {
  return Wilaya.find().sort({ name: 1 });
};

const removePatient = async (patientId) => {
  const PatientModel = require('../models/Patient');
  const patient = await PatientModel.findById(patientId);
  if (!patient) throw new Error('Patient not found');
  const userId = patient.user;
  // remove related appointments
  await Appointment.deleteMany({ patient: patientId });
  // remove patient document
  await PatientModel.findByIdAndDelete(patientId);
  // remove user account
  await User.findByIdAndDelete(userId);
  return { success: true };
};

module.exports = { getDashboardStats, manageSpecialty, manageWilaya, listUsers, listDoctorsAdmin, listAppointmentsAdmin, listReviewsAdmin, listSpecialties, listWilayas, removePatient };
