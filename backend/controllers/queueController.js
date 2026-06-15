const QueueService = require('../services/queueService');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const socketService = require('../services/socketService');

const resolveDoctorId = async (doctorId, user) => {
  if (user?.role !== 'doctor') return doctorId;
  const doctorProfile = await Doctor.findOne({ user: user._id });
  if (!doctorProfile) {
    throw new Error('Doctor profile not found');
  }
  if (!doctorId || doctorId === user._id.toString() || doctorId === doctorProfile._id.toString()) {
    return doctorProfile._id.toString();
  }
  throw new Error('Forbidden: cannot access another doctor queue');
};

exports.joinQueue = async (req, res, next) => {
  try {
    const { doctorId, appointmentId } = req.body;
    const clinicId = req.query.clinicId;
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    const result = await QueueService.joinQueue(doctorId, clinicId, patient._id, appointmentId);
      // emit real-time update to clinic/doctor room
      const room = `doctor_${doctorId}_clinic_${clinicId || 'default'}`;
      socketService.emit('queue:joined', room, result);
      res.status(201).json(result);
  } catch (err) { next(err); }
};

exports.getQueueStatus = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { clinicId } = req.query;
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    const status = await QueueService.getQueueStatus(doctorId, clinicId, patient._id);
    res.json(status);
  } catch (err) { next(err); }
};

exports.getQueueForClinic = async (req, res, next) => {
  try {
    const { clinicId } = req.params;
    const queue = await QueueService.getQueueForClinic(clinicId);
    res.json(queue || { entries: [] });
  } catch (err) { next(err); }
};

exports.getDoctorQueueSummary = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const resolvedDoctorId = await resolveDoctorId(doctorId, req.user);
    const summary = await QueueService.getDoctorQueueSummary(resolvedDoctorId);
    res.json(summary);
  } catch (err) { next(err); }
};

exports.callNextPatient = async (req, res, next) => {
  try {
    const { doctorId, clinicId } = req.body;
    const resolvedDoctorId = await resolveDoctorId(doctorId, req.user);
    const result = await QueueService.callNextPatient(resolvedDoctorId, clinicId);
      // notify clinic and specific patient
      const room = `doctor_${resolvedDoctorId}_clinic_${clinicId || 'default'}`;
      socketService.emit('queue:called', room, result);
      if (result?.calledPatient?.patientId) {
        socketService.emit('queue:called:patient', `patient_${result.calledPatient.patientId}`, result.calledPatient);
      }
      res.json(result);
  } catch (err) { next(err); }
};

exports.markAsServed = async (req, res, next) => {
  try {
    const { doctorId, clinicId, patientQueueId } = req.body;
    const resolvedDoctorId = await resolveDoctorId(doctorId, req.user);
    const result = await QueueService.markAsServed(resolvedDoctorId, clinicId, patientQueueId);
      const room = `doctor_${resolvedDoctorId}_clinic_${clinicId || 'default'}`;
      socketService.emit('queue:served', room, result);
      res.json(result);
  } catch (err) { next(err); }
};

exports.getQueueAnalytics = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const resolvedDoctorId = await resolveDoctorId(doctorId, req.user);
    const { startDate, endDate } = req.query;
    const stats = await QueueService.getQueueAnalytics(resolvedDoctorId, new Date(startDate), new Date(endDate));
    res.json(stats);
  } catch (err) { next(err); }
};
