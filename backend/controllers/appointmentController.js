const { bookAppointment, getAppointments, updateAppointmentStatus, rescheduleAppointment } = require('../services/appointmentService');
const Patient = require('../models/Patient');

const createAppointment = async (req, res, next) => {
  try {
    const patientProfile = await Patient.findOne({ user: req.user._id });
    if (!patientProfile) {
      return res.status(400).json({ message: 'Patient profile not found' });
    }
    const appointment = await bookAppointment({
      patientId: patientProfile._id,
      doctorId: req.body.doctorId,
      scheduledAt: req.body.scheduledAt,
      reason: req.body.reason,
      price: req.body.price
    });
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await getAppointments(req.query, { skip: Number(req.query.skip) || 0, limit: Number(req.query.limit) || 50 });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const appointment = await updateAppointmentStatus(req.params.id, req.body.status);
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

const reschedule = async (req, res, next) => {
  try {
    const appointment = await rescheduleAppointment(req.params.id, req.body.scheduledAt);
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

module.exports = { createAppointment, getAllAppointments, changeStatus, reschedule };
