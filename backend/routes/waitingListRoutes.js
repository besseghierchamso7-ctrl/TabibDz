const router = require('express').Router();
const waitingController = require('../controllers/waitingListController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('patient'), waitingController.addToWaitingList);
router.get('/my-list', protect, authorize('patient'), waitingController.getPatientWaitingList);
router.get('/doctor/:doctorId', protect, authorize('doctor', 'clinic_manager', 'admin'), waitingController.getWaitingListByDoctor);
router.post('/check-and-offer', protect, authorize('doctor', 'clinic_manager', 'admin'), waitingController.checkAndOfferSlots);
router.post('/:waitingListId/accept', protect, authorize('patient'), waitingController.acceptOffer);
router.post('/:waitingListId/decline', protect, authorize('patient'), waitingController.declineOffer);
router.post('/:waitingListId/cancel', protect, authorize('patient'), waitingController.cancelWaitingList);
router.get('/stats/:doctorId', protect, authorize('doctor', 'clinic_manager', 'admin'), waitingController.getStatistics);
router.post('/:id/notify', protect, authorize('admin'), waitingController.markNotified);

module.exports = router;
