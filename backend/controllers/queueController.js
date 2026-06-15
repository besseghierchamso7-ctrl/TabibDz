const QueueService = require('../services/queueService');
const Patient = require('../models/Patient');

exports.joinQueue = async (req, res, next) => {
  try {
    const { doctorId, appointmentId } = req.body;
    const clinicId = req.query.clinicId;
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    const result = await QueueService.joinQueue(doctorId, clinicId, patient._id, appointmentId);
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

exports.callNextPatient = async (req, res, next) => {
  try {
    const { doctorId, clinicId } = req.body;
    const result = await QueueService.callNextPatient(doctorId, clinicId);
    res.json(result);
  } catch (err) { next(err); }
};

exports.markAsServed = async (req, res, next) => {
  try {
    const { doctorId, clinicId, patientQueueId } = req.body;
    const result = await QueueService.markAsServed(doctorId, clinicId, patientQueueId);
    res.json(result);
  } catch (err) { next(err); }
};

exports.getQueueAnalytics = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { startDate, endDate } = req.query;
    const stats = await QueueService.getQueueAnalytics(doctorId, new Date(startDate), new Date(endDate));
    res.json(stats);
  } catch (err) { next(err); }
};
