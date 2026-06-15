const { getDashboardStats, manageSpecialty, manageWilaya, listUsers, listDoctorsAdmin, listAppointmentsAdmin, listReviewsAdmin, listSpecialties, listWilayas, removePatient } = require('../services/adminService');

const dashboard = async (req, res, next) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

const createSpecialty = async (req, res, next) => {
  try {
    const specialty = await manageSpecialty(req.body);
    res.status(201).json(specialty);
  } catch (error) {
    next(error);
  }
};

const createWilaya = async (req, res, next) => {
  try {
    const wilaya = await manageWilaya(req.body);
    res.status(201).json(wilaya);
  } catch (error) {
    next(error);
  }
};

const getSpecialties = async (req, res, next) => {
  try {
    const specialties = await listSpecialties();
    res.json(specialties);
  } catch (error) {
    next(error);
  }
};

const getWilayas = async (req, res, next) => {
  try {
    const wilayas = await listWilayas();
    res.json(wilayas);
  } catch (error) {
    next(error);
  }
};

const patients = async (req, res, next) => {
  try {
    const users = await listUsers('patient');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const result = await removePatient(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const doctors = async (req, res, next) => {
  try {
    const doctors = await listDoctorsAdmin();
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

const appointments = async (req, res, next) => {
  try {
    const appointments = await listAppointmentsAdmin();
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

const reviews = async (req, res, next) => {
  try {
    const reviews = await listReviewsAdmin();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = { dashboard, createSpecialty, createWilaya, listSpecialties: getSpecialties, listWilayas: getWilayas, patients, doctors, appointments, reviews, deletePatient };
