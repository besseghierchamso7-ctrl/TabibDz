const express = require('express');
const { listWilayas, getWilaya, createWilaya } = require('../controllers/wilayaController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listWilayas);
router.get('/:id', getWilaya);
router.post('/', protect, authorize('admin'), createWilaya);

module.exports = router;
