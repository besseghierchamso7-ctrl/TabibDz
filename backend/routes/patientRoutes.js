const express = require('express');
const { profile, createProfile, editProfile, favoriteDoctor, unfavoriteDoctor, notifications, readNotification } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/me', profile);
router.post('/', authorize('patient'), createProfile);
router.put('/:id', authorize('patient'), editProfile);
router.post('/:id/favorites', authorize('patient'), favoriteDoctor);
router.delete('/:id/favorites', authorize('patient'), unfavoriteDoctor);
router.get('/notifications', notifications);
router.put('/notifications/:id/read', readNotification);

module.exports = router;
