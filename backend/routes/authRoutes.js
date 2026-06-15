const express = require('express');
const { registerUser, loginUser, refreshToken, forgotPassword, resetPasswordController, getCurrentUser, updateCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', protect, getCurrentUser);
router.put('/me', protect, updateCurrentUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPasswordController);

module.exports = router;
