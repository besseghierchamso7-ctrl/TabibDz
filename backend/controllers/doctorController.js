const { requestDoctorRegistration, getDoctors, getDoctorById, updateDoctorProfile, verifyDoctor, getTopDoctors, getDoctorAvailability } = require('../services/doctorService');

const createDoctorRequest = async (req, res, next) => {
  try {
    const doctor = await requestDoctorRegistration(req.user._id, req.body);
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
};

const listDoctors = async (req, res, next) => {
  try {
    const doctors = await getDoctors(req.query, { skip: Number(req.query.skip) || 0, limit: Number(req.query.limit) || 20 });
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

const doctorDetails = async (req, res, next) => {
  try {
    const doctor = await getDoctorById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await updateDoctorProfile(req.params.id, req.body);
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const approveDoctor = async (req, res, next) => {
  try {
    const doctor = await verifyDoctor(req.params.id, req.body.status);
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const getAvailability = async (req, res, next) => {
  try {
    const availability = await getDoctorAvailability(req.params.id, req.query);
    res.json(availability);
  } catch (error) {
    next(error);
  }
};

const topDoctors = async (req, res, next) => {
  try {
    const doctors = await getTopDoctors();
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

module.exports = { createDoctorRequest, listDoctors, doctorDetails, updateDoctor, approveDoctor, getAvailability, topDoctors };
