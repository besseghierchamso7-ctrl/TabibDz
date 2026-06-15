const router = require('express').Router();
const teleconsultationController = require('../controllers/teleconsultationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('doctor','admin'), teleconsultationController.create);
router.get('/my', protect, teleconsultationController.listMy);
router.get('/:id', protect, teleconsultationController.get);
router.post('/:id/start', protect, authorize('doctor','admin'), teleconsultationController.start);
router.post('/:id/end', protect, authorize('doctor','admin'), teleconsultationController.end);

module.exports = router;
