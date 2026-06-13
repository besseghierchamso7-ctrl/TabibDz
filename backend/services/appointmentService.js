const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Notification = require('../models/Notification');

const isSlotAvailable = async (doctorId, scheduledAt) => {
  const conflict = await Appointment.findOne({ doctor: doctorId, scheduledAt, status: { $in: ['pending', 'confirmed'] } });
  return !conflict;
};

const bookAppointment = async ({ patientId, doctorId, scheduledAt, reason, price }) => {
  const patient = await Patient.findById(patientId);
  if (!patient) throw new Error('Patient profile not found');
  const doctor = await Doctor.findById(doctorId);
  if (!doctor || doctor.status !== 'verified') throw new Error('Doctor unavailable');
  if (!(await isSlotAvailable(doctorId, new Date(scheduledAt)))) {
    throw new Error('Selected time slot is no longer available');
  }
  const appointment = await Appointment.create({ patient: patientId, doctor: doctorId, scheduledAt, reason, price, createdBy: patient.user });
  await Notification.create({ user: patient.user, title: 'Rendez-vous réservé', message: 'Votre rendez-vous a été enregistré et est en attente de confirmation.', type: 'appointment' });
  return appointment;
};

const getAppointments = async (filters, pagination = {}) => {
  const query = {};
  if (filters.patient) query.patient = filters.patient;
  if (filters.doctor) query.doctor = filters.doctor;
  if (filters.status) query.status = filters.status;
  if (filters.after) query.scheduledAt = { $gte: new Date(filters.after) };
  return Appointment.find(query)
    .populate('doctor patient')
    .sort({ scheduledAt: 1 })
    .skip(pagination.skip || 0)
    .limit(pagination.limit || 50);
};

const updateAppointmentStatus = async (appointmentId, status) => {
  const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });
  if (!appointment) throw new Error('Appointment not found');
  return appointment;
};

const rescheduleAppointment = async (appointmentId, scheduledAt) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new Error('Appointment not found');
  if (!(await isSlotAvailable(appointment.doctor, new Date(scheduledAt)))) {
    throw new Error('Selected time slot is no longer available');
  }
  appointment.scheduledAt = scheduledAt;
  appointment.status = 'pending';
  await appointment.save();
  return appointment;
};

module.exports = { isSlotAvailable, bookAppointment, getAppointments, updateAppointmentStatus, rescheduleAppointment };
