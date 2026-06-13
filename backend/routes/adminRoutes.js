const express = require('express');
const { dashboard, createSpecialty, createWilaya, patients, doctors, appointments, reviews } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/dashboard', dashboard);
router.post('/specialties', createSpecialty);
router.post('/wilayas', createWilaya);
router.get('/patients', patients);
router.get('/doctors', doctors);
router.get('/appointments', appointments);
router.get('/reviews', reviews);

module.exports = router;
