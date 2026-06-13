const express = require('express');
const { registerUser, loginUser, refreshToken, forgotPassword, resetPasswordController } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPasswordController);

module.exports = router;
