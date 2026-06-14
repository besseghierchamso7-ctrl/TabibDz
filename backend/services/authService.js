const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/token');
const { sendEmail } = require('../config/mail');

const createApiError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sanitizeUser = (user) => {
  const userObject = user.toObject ? user.toObject() : { ...user };
  delete userObject.password;
  delete userObject.refreshToken;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  return userObject;
};

const sendRegistrationEmail = async (user) => {
  try {
    await sendEmail({
      to: user.email,
      subject: 'Bienvenue sur Tabib DZ',
      html: `
        <p>Bonjour ${user.firstName},</p>
        <p>Merci de vous être inscrit sur Tabib DZ. Votre compte a été créé avec succès.</p>
        <p>Vous pouvez maintenant vous connecter et prendre rendez-vous avec nos médecins.</p>
        <p>À bientôt,<br/>L'équipe Tabib DZ</p>
      `
    });
  } catch (error) {
    console.error('Registration email failed:', error);
  }
};

const register = async (data) => {
  const userExists = await User.findOne({ email: data.email });
  if (userExists) {
    throw createApiError('Email already registered', 409);
  }
  const user = await User.create(data);
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  await sendRegistrationEmail(user);
  return { user: sanitizeUser(user), token, refreshToken };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw createApiError('Invalid credentials', 401);
  }
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  return { user: sanitizeUser(user), token, refreshToken };
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
