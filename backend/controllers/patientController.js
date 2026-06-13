const { getPatientProfile, createPatientProfile, updatePatientProfile, addFavoriteDoctor, removeFavoriteDoctor, getNotifications, markNotificationRead } = require('../services/patientService');

const profile = async (req, res, next) => {
  try {
    const patient = await getPatientProfile(req.user._id);
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

const createProfile = async (req, res, next) => {
  try {
    const patient = await createPatientProfile(req.user._id);
    res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
};

const editProfile = async (req, res, next) => {
  try {
    const patient = await updatePatientProfile(req.params.id, req.body);
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

const favoriteDoctor = async (req, res, next) => {
  try {
    const patient = await addFavoriteDoctor(req.params.id, req.body.doctorId);
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

const unfavoriteDoctor = async (req, res, next) => {
  try {
    const patient = await removeFavoriteDoctor(req.params.id, req.body.doctorId);
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

const notifications = async (req, res, next) => {
  try {
    const notes = await getNotifications(req.user._id);
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

const readNotification = async (req, res, next) => {
  try {
    const note = await markNotificationRead(req.params.id);
    res.json(note);
  } catch (error) {
    next(error);
  }
};

module.exports = { profile, createProfile, editProfile, favoriteDoctor, unfavoriteDoctor, notifications, readNotification };
