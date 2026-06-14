const router = require('express').Router();
const reminderController = require('../controllers/reminderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, reminderController.create);
router.get('/pending', protect, admin, reminderController.listPending);
router.post('/:id/sent', protect, admin, reminderController.markSent);

module.exports = router;
