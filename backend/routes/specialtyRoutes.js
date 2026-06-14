const express = require('express');
const { listSpecialties, getSpecialty, createSpecialty } = require('../controllers/specialtyController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listSpecialties);
router.get('/:id', getSpecialty);
router.post('/', protect, authorize('admin'), createSpecialty);

module.exports = router;
