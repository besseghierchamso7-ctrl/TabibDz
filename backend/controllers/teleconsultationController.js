const teleconsultationService = require('../services/teleconsultationService');

exports.create = async (req, res, next) => {
  try {
    const { appointmentId, patientId, clinicId, scheduledAt } = req.body;
    const doctorId = req.user.role === 'doctor' ? req.user._id : req.body.doctorId;
    const session = await teleconsultationService.create({
      appointmentId,
      doctorId,
      patientId,
      clinicId,
      scheduledAt
    });
    res.status(201).json(session);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const session = await teleconsultationService.getById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Not found' });
    res.json(session);
  } catch (err) { next(err); }
};

exports.listMy = async (req, res, next) => {
  try {
    if (req.user.role === 'doctor') {
      const list = await teleconsultationService.listByDoctor(req.user._id);
      return res.json(list);
    }
    if (req.user.role === 'patient') {
      const list = await teleconsultationService.listByPatient(req.user._id);
      return res.json(list);
    }
    res.status(403).json({ message: 'Forbidden' });
  } catch (err) { next(err); }
};

exports.start = async (req, res, next) => {
  try {
    const id = req.params.id;
    const sess = await teleconsultationService.updateStatus(id, 'in_progress');
    res.json(sess);
  } catch (err) { next(err); }
};

exports.end = async (req, res, next) => {
  try {
    const id = req.params.id;
    const sess = await teleconsultationService.updateStatus(id, 'completed');
    res.json(sess);
  } catch (err) { next(err); }
};
