const Specialty = require('../models/Specialty');

const listSpecialties = async (req, res, next) => {
  try {
    const specialties = await Specialty.find().sort({ name: 1 });
    res.json(specialties);
  } catch (error) {
    next(error);
  }
};

const getSpecialty = async (req, res, next) => {
  try {
    const specialty = await Specialty.findById(req.params.id);
    if (!specialty) return res.status(404).json({ message: 'Specialty not found' });
    res.json(specialty);
  } catch (error) {
    next(error);
  }
};

const createSpecialty = async (req, res, next) => {
  try {
    const specialty = new Specialty(req.body);
    await specialty.save();
    res.status(201).json(specialty);
  } catch (error) {
    next(error);
  }
};

module.exports = { listSpecialties, getSpecialty, createSpecialty };
