const express = require('express');
const { createDoctorRequest, listDoctors, doctorDetails, updateDoctor, approveDoctor, topDoctors } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router.get('/', listDoctors);
router.get('/top', topDoctors);
router.get('/:id', doctorDetails);
router.post('/request', protect, authorize('doctor', 'admin'), createDoctorRequest);
router.put('/:id', protect, authorize('doctor', 'admin'), updateDoctor);
router.put('/:id/verify', protect, authorize('admin'), approveDoctor);
router.post('/:id/upload-documents', protect, authorize('doctor'), upload.fields([{ name: 'diploma', maxCount: 1 }, { name: 'photo', maxCount: 1 }]), async (req, res, next) => {
  try {
    res.json({ files: req.files });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
