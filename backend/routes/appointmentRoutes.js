const express = require('express');
const { createAppointment, getAllAppointments, changeStatus, reschedule } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', authorize('patient'), createAppointment);
router.get('/', getAllAppointments);
router.put('/:id/status', authorize('doctor', 'admin'), changeStatus);
router.put('/:id/reschedule', authorize('patient', 'doctor'), reschedule);

module.exports = router;
