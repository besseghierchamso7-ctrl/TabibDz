const router = require('express').Router();
const prescriptionController = require('../controllers/prescriptionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, prescriptionController.create);
router.get('/patient/:patientId', protect, prescriptionController.listByPatient);
router.get('/:id', protect, prescriptionController.get);

module.exports = router;
