const Wilaya = require('../models/Wilaya');

const listWilayas = async (req, res, next) => {
  try {
    const wilayas = await Wilaya.find().sort({ code: 1 });
    res.json(wilayas);
  } catch (error) {
    next(error);
  }
};

const getWilaya = async (req, res, next) => {
  try {
    const wilaya = await Wilaya.findById(req.params.id);
    if (!wilaya) return res.status(404).json({ message: 'Wilaya not found' });
    res.json(wilaya);
  } catch (error) {
    next(error);
  }
};

const createWilaya = async (req, res, next) => {
  try {
    const wilaya = new Wilaya(req.body);
    await wilaya.save();
    res.status(201).json(wilaya);
  } catch (error) {
    next(error);
  }
};

module.exports = { listWilayas, getWilaya, createWilaya };
