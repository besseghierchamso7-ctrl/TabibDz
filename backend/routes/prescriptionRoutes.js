const router = require('express').Router();
const prescriptionController = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('doctor', 'admin'), prescriptionController.create);
router.get('/patient/:patientId', protect, authorize('doctor', 'admin'), prescriptionController.listByPatient);
router.get('/my', protect, prescriptionController.listMy);
router.get('/:id', protect, prescriptionController.get);
router.post('/:id/revoke', protect, authorize('doctor', 'admin'), prescriptionController.revoke);

module.exports = router;
