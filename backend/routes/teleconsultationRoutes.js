const express = require('express');
const router = express.Router();
const teleController = require('../controllers/teleconsultationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, teleController.list);
router.post('/', protect, teleController.create);
router.get('/:id', protect, teleController.get);
router.put('/:id', protect, teleController.update);
router.delete('/:id', protect, teleController.remove);

module.exports = router;
