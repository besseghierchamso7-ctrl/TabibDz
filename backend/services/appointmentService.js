const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Notification = require('../models/Notification');
const socketService = require('./../services/socketService');

const isSlotAvailable = async (doctorId, scheduledAt) => {
  const conflict = await Appointment.findOne({ doctor: doctorId, scheduledAt, status: { $in: ['pending', 'confirmed'] } });
  return !conflict;
};

const isDoctorAvailableAt = (doctor, scheduledAt) => {
  if (!doctor.availability || !doctor.availability.days || !doctor.availability.timeSlots) {
    return true;
  }
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const scheduledDate = new Date(scheduledAt);
  const dayName = dayNames[scheduledDate.getDay()];
  const time = scheduledDate.toISOString().slice(11, 16);
  return doctor.availability.days.includes(dayName) && doctor.availability.timeSlots.includes(time);
};

const bookAppointment = async ({ patientId, doctorId, scheduledAt, reason, price }) => {
  const patient = await Patient.findById(patientId);
  if (!patient) throw new Error('Patient profile not found');
  const doctor = await Doctor.findById(doctorId);
  if (!doctor || doctor.status !== 'verified') throw new Error('Doctor unavailable');
  const scheduledDate = new Date(scheduledAt);
  if (!(await isSlotAvailable(doctorId, scheduledDate))) {
    throw new Error('Selected time slot is no longer available');
  }
  if (!isDoctorAvailableAt(doctor, scheduledDate)) {
    throw new Error('Selected time is outside the doctor availability');
  }
  const appointment = await Appointment.create({ patient: patientId, doctor: doctorId, scheduledAt: scheduledDate, reason, price, createdBy: patient.user });
  await Notification.create({ user: patient.user, title: 'Rendez-vous réservé', message: 'Votre rendez-vous a été enregistré et est en attente de confirmation.', type: 'appointment' });
  try {
    socketService.emit('appointment:created', `doctor_${doctorId}`, appointment);
    socketService.emit('appointment:created', null, appointment); // broadcast
  } catch (e) {
    console.error('Socket emit error (bookAppointment):', e);
  }
  return appointment;
};

const getAppointments = async (filters, pagination = {}) => {
  const query = {};
  if (filters.patient) query.patient = filters.patient;
  if (filters.doctor) query.doctor = filters.doctor;
  if (filters.status) {
    const statuses = Array.isArray(filters.status)
      ? filters.status
      : String(filters.status).split(',').map((s) => s.trim()).filter(Boolean);
    if (statuses.length === 1) {
      query.status = statuses[0];
    } else if (statuses.length > 1) {
      query.status = { $in: statuses };
    }
  }
  if (filters.after) query.scheduledAt = { ...query.scheduledAt, $gte: new Date(filters.after) };
  if (filters.before) query.scheduledAt = { ...query.scheduledAt, $lte: new Date(filters.before) };
  return Appointment.find(query)
    .populate('doctor patient')
    .sort({ scheduledAt: 1 })
    .skip(pagination.skip || 0)
    .limit(pagination.limit || 50);
};

const updateAppointmentStatus = async (appointmentId, status) => {
  const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });
  if (!appointment) throw new Error('Appointment not found');
  try {
    // emit status update to doctor room and patient
    socketService.emit('appointment:updated', `doctor_${appointment.doctor}`, appointment);
    socketService.emit('appointment:updated', `patient_${appointment.patient}`, appointment);
    socketService.emit('appointment:updated', null, appointment); // broadcast for admin
  } catch (e) {
    console.error('Socket emit error (updateAppointmentStatus):', e);
  }
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

const cancelAppointment = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new Error('Appointment not found');
  appointment.status = 'cancelled';
  await appointment.save();
  try {
    socketService.emit('appointment:updated', `doctor_${appointment.doctor}`, appointment);
    socketService.emit('appointment:updated', `patient_${appointment.patient}`, appointment);
    socketService.emit('appointment:updated', null, appointment);
  } catch (e) {
    console.error('Socket emit error (cancelAppointment):', e);
  }
  return appointment;
};

module.exports = { isSlotAvailable, bookAppointment, getAppointments, updateAppointmentStatus, rescheduleAppointment, cancelAppointment };
