const { bookAppointment, getAppointments, updateAppointmentStatus, rescheduleAppointment, cancelAppointment } = require('../services/appointmentService');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

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
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role === 'patient') {
      const patientProfile = await Patient.findOne({ user: req.user._id });
      if (!patientProfile || appointment.patient.toString() !== patientProfile._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: cannot reschedule this appointment' });
      }
    }

    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (!doctorProfile || appointment.doctor.toString() !== doctorProfile._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: cannot reschedule this appointment' });
      }
    }

    const updatedAppointment = await rescheduleAppointment(req.params.id, req.body.scheduledAt);
    res.json(updatedAppointment);
  } catch (error) {
    next(error);
  }
};

const cancel = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role === 'patient') {
      const patientProfile = await Patient.findOne({ user: req.user._id });
      if (!patientProfile || appointment.patient.toString() !== patientProfile._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: cannot cancel this appointment' });
      }
    }

    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (!doctorProfile || appointment.doctor.toString() !== doctorProfile._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: cannot cancel this appointment' });
      }
    }

    const cancelled = await cancelAppointment(req.params.id);
    res.json(cancelled);
  } catch (error) {
    next(error);
  }
};

module.exports = { createAppointment, getAllAppointments, changeStatus, reschedule, cancel };
