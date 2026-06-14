const router = require('express').Router();
const waitingController = require('../controllers/waitingListController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, waitingController.add);
router.get('/doctor/:doctorId', protect, admin, waitingController.listByDoctor);
router.post('/:id/notify', protect, admin, waitingController.markNotified);

module.exports = router;
