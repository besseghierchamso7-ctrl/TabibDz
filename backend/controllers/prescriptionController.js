const prescriptionService = require('../services/prescriptionService');
const { authorize } = require('../middleware/authMiddleware');

exports.create = async (req, res, next) => {
  try {
    const body = Object.assign({}, req.body, { doctor: req.user.id });
    const p = await prescriptionService.create(body);
    res.status(201).json(p);
  } catch (err) { next(err); }
};

exports.listByPatient = async (req, res, next) => {
  try {
    const list = await prescriptionService.listByPatient(req.params.patientId);
    res.json(list);
  } catch (err) { next(err); }
};

exports.listMy = async (req, res, next) => {
  try {
    if (req.user.role === 'patient') {
      const list = await prescriptionService.listByPatient(req.user._id);
      return res.json(list);
    }
    // if doctor, return prescriptions authored by doctor
    if (req.user.role === 'doctor') {
      const list = await prescriptionService.listByDoctor(req.user._id);
      return res.json(list);
    }
    res.status(403).json({ message: 'Forbidden' });
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const p = await prescriptionService.getById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) { next(err); }
};

exports.revoke = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doctorId = req.user.role === 'doctor' ? req.user._id : null;
    if (!doctorId && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const presc = await prescriptionService.revoke(id, doctorId);
    res.json({ success: true, prescription: presc });
  } catch (err) { next(err); }
};
