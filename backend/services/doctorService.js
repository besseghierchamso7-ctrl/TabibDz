const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
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

const getDoctorAvailability = async (doctorId, query = {}) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new Error('Doctor not found');
  }

  const startDate = query.from ? new Date(query.from) : new Date();
  startDate.setHours(0, 0, 0, 0);
  const daysAhead = Number(query.days) || 14;
  const availDates = [];
  const statusFilter = ['pending', 'confirmed'];

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const dateCandidates = [];
  for (let i = 0; i < daysAhead; i += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dayName = dayNames[date.getDay()];
    if (!doctor.availability?.days?.length || doctor.availability.days.includes(dayName)) {
      const dateKey = date.toISOString().slice(0, 10);
      dateCandidates.push({ date, dateKey });
    }
  }

  const fromUTC = dateCandidates.length ? new Date(`${dateCandidates[0].date.toISOString().slice(0, 10)}T00:00:00.000Z`) : new Date();
  const toUTC = dateCandidates.length ? new Date(`${dateCandidates[dateCandidates.length - 1].date.toISOString().slice(0, 10)}T23:59:59.999Z`) : new Date();

  const existingAppointments = await Appointment.find({
    doctor: doctorId,
    scheduledAt: { $gte: fromUTC, $lte: toUTC },
    status: { $in: statusFilter }
  });

  const existingSet = new Set(existingAppointments.map((appt) => `${appt.scheduledAt.toISOString().slice(0, 10)}T${appt.scheduledAt.toISOString().slice(11, 16)}`));

  for (const candidate of dateCandidates) {
    const availableTimes = [];
    const timeSlots = doctor.availability?.timeSlots || [];
    for (const timeSlot of timeSlots) {
      const scheduledAt = new Date(`${candidate.dateKey}T${timeSlot}:00.000Z`);
      const isoKey = `${candidate.dateKey}T${timeSlot}`;
      if (!existingSet.has(isoKey)) {
        availableTimes.push(timeSlot);
      }
    }
    if (availableTimes.length) {
      availDates.push({
        date: candidate.dateKey,
        times: availableTimes
      });
    }
  }

  return {
    doctorId,
    dateRanges: availDates,
    availability: doctor.availability
  };
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
