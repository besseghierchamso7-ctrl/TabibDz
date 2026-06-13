const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/token');
const { sendEmail } = require('../config/mail');

const register = async (data) => {
  const userExists = await User.findOne({ email: data.email });
  if (userExists) {
    throw new Error('Email already registered');
  }
  const user = await User.create(data);
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  return { user, token, refreshToken };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Invalid credentials');
  }
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  return { user, token, refreshToken };
};

const refreshAuthToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token) {
    throw new Error('Invalid refresh token');
  }
  const newToken = generateToken(user);
  const newRefreshToken = generateRefreshToken(user);
  user.refreshToken = newRefreshToken;
  await user.save();
  return { token: newToken, refreshToken: newRefreshToken };
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email not found');
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Mot de passe oublié - Tabib DZ',
    html: `<p>Bonjour ${user.firstName},</p><p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe : <a href="${resetUrl}">${resetUrl}</a></p>`
  });
  return true;
};

const resetPassword = async (token, password) => {
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) throw new Error('Token invalide ou expiré');
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return true;
};

module.exports = { register, login, refreshAuthToken, requestPasswordReset, resetPassword };
