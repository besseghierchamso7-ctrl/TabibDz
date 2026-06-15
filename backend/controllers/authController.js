const { register, login, refreshAuthToken, requestPasswordReset, resetPassword, updateUserProfile } = require('../services/authService');

const registerUser = async (req, res, next) => {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user.toObject ? req.user.toObject() : { ...req.user };
    if (user.role === 'doctor') {
      const Doctor = require('../models/Doctor');
      const doctorProfile = await Doctor.findOne({ user: user._id }).select('_id');
      if (doctorProfile) {
        user.doctorProfileId = doctorProfile._id.toString();
      }
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateCurrentUser = async (req, res, next) => {
  try {
    const updatedUser = await updateUserProfile(req.user._id, req.body);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await refreshAuthToken(refreshToken);
    res.json(tokens);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    await requestPasswordReset(req.body.email);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

const resetPasswordController = async (req, res, next) => {
  try {
    const { token } = req.params;
    await resetPassword(token, req.body.password);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, refreshToken, forgotPassword, resetPasswordController, getCurrentUser, updateCurrentUser };
