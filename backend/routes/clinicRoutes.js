const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', clinicController.listClinics);
router.post('/', protect, admin, clinicController.createClinic);
router.get('/:id', clinicController.getClinic);
router.put('/:id', protect, admin, clinicController.updateClinic);
router.delete('/:id', protect, admin, clinicController.deleteClinic);

module.exports = router;
