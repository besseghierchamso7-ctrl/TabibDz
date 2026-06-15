const router = require('express').Router();
const queueController = require('../controllers/queueController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/join', protect, authorize('patient'), queueController.joinQueue);
router.get('/status/:doctorId', protect, authorize('patient'), queueController.getQueueStatus);
router.get('/clinic/:clinicId', protect, authorize('doctor', 'clinic_manager', 'admin'), queueController.getQueueForClinic);
router.get('/doctor/:doctorId/summary', protect, authorize('doctor', 'clinic_manager', 'admin'), queueController.getDoctorQueueSummary);
router.post('/call-next', protect, authorize('doctor', 'clinic_manager', 'admin'), queueController.callNextPatient);
router.post('/mark-served', protect, authorize('doctor', 'clinic_manager', 'admin'), queueController.markAsServed);
router.get('/analytics/:doctorId', protect, authorize('doctor', 'clinic_manager', 'admin'), queueController.getQueueAnalytics);

module.exports = router;
