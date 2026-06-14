const router = require('express').Router();
const queueController = require('../controllers/queueController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/:clinicId', protect, queueController.get);
router.post('/:clinicId/join', protect, queueController.join);
router.post('/:clinicId/call', protect, admin, queueController.callNext);

module.exports = router;
