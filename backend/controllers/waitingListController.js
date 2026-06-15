const WaitingListService = require('../services/waitingListService');
const Patient = require('../models/Patient');
const socketService = require('../services/socketService');

exports.addToWaitingList = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    const entry = await WaitingListService.addToWaitingList(patient._id, req.body.doctorId, req.body);
    res.status(201).json(entry);
  } catch (err) { next(err); }
};

exports.getWaitingListByDoctor = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { status } = req.query;
    const list = await WaitingListService.getWaitingListByDoctor(doctorId, status || 'active');
    res.json(list);
  } catch (err) { next(err); }
};

exports.getPatientWaitingList = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    const list = await WaitingListService.getPatientWaitingList(patient._id);
    res.json(list);
  } catch (err) { next(err); }
};

exports.checkAndOfferSlots = async (req, res, next) => {
  try {
    const { doctorId, clinicId } = req.body;
    const results = await WaitingListService.checkAndOfferSlots(doctorId, clinicId);
    // Emit offers to patients and notify doctor room
    try {
      const room = `doctor_${doctorId}_clinic_${clinicId || 'default'}`;
      socketService.emit('waitingList:offersCreated', room, { count: results.length });
      for (const match of results) {
        if (match.patientId) {
          socketService.emit('waitingList:offer', `patient_${match.patientId}`, match);
        }
      }
    } catch (emitErr) {
      console.error('Error emitting waiting list offers:', emitErr);
    }

    res.json({ offered: results.length, slots: results });
  } catch (err) { next(err); }
};

exports.acceptOffer = async (req, res, next) => {
  try {
    const { waitingListId } = req.params;
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    const appointment = await WaitingListService.acceptOffer(waitingListId, patient._id);
    // notify doctor and patient rooms
    try {
      const waitEntry = await require('../models/WaitingList').findById(waitingListId);
      const doctorId = waitEntry?.doctor;
      const clinicId = waitEntry?.clinic || 'default';
      const room = `doctor_${doctorId}_clinic_${clinicId}`;
      socketService.emit('waitingList:accepted', room, { waitingListId, appointment });
      socketService.emit('waitingList:accepted:patient', `patient_${patient._id}`, { waitingListId, appointment });
    } catch (emitErr) {
      console.error('Error emitting acceptOffer events:', emitErr);
    }
    res.json(appointment);
  } catch (err) { next(err); }
};

exports.declineOffer = async (req, res, next) => {
  try {
    const { waitingListId } = req.params;
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    const result = await WaitingListService.declineOffer(waitingListId, patient._id);
    // notify doctor and patient rooms
    try {
      const waitEntry = await require('../models/WaitingList').findById(waitingListId);
      const doctorId = waitEntry?.doctor;
      const clinicId = waitEntry?.clinic || 'default';
      const room = `doctor_${doctorId}_clinic_${clinicId}`;
      socketService.emit('waitingList:declined', room, { waitingListId, patientId: patient._id });
      socketService.emit('waitingList:declined:patient', `patient_${patient._id}`, { waitingListId });
    } catch (emitErr) {
      console.error('Error emitting declineOffer events:', emitErr);
    }
    res.json(result);
  } catch (err) { next(err); }
};

exports.cancelWaitingList = async (req, res, next) => {
  try {
    const { waitingListId } = req.params;
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    const result = await WaitingListService.cancelWaitingList(waitingListId, patient._id);
    res.json(result);
  } catch (err) { next(err); }
};

exports.getStatistics = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const stats = await WaitingListService.getStatistics(doctorId);
    res.json(stats);
  } catch (err) { next(err); }
};

exports.markNotified = async (req, res, next) => {
  try {
    const updated = await WaitingListService.markAsNotified(req.params.id);
    res.json(updated);
  } catch (err) { next(err); }
};
