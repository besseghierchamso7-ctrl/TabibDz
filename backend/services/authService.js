const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { generateToken, generateRefreshToken } = require('../utils/token');
const { sendEmail } = require('../config/mail');

const createApiError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sanitizeUser = async (user) => {
  const userObject = user.toObject ? user.toObject() : { ...user };
  delete userObject.password;
  delete userObject.refreshToken;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;

  if (userObject.role === 'doctor') {
    const doctorProfile = await Doctor.findOne({ user: userObject._id }).select('_id');
    if (doctorProfile) {
      userObject.doctorProfileId = doctorProfile._id.toString();
    }
  }

  return userObject;
};

const sendRegistrationEmail = async (user) => {
  try {
    const roleText = user.role === 'doctor' ? 'Votre demande d\'enregistrement en tant que médecin a été reçue et est en attente d\'approbation de l\'administrateur.' : 'Vous pouvez maintenant vous connecter et prendre rendez-vous avec nos médecins.';
    await sendEmail({
      to: user.email,
      subject: 'Bienvenue sur Tabib DZ',
      html: `
        <p>Bonjour ${user.firstName},</p>
        <p>Merci de vous être inscrit sur Tabib DZ. Votre compte a été créé avec succès.</p>
        <p>${roleText}</p>
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
  
  // Extract doctor-specific fields
  const specialtyId = data.specialty;
  const wilayaId = data.wilaya;
  const userData = { ...data };
  delete userData.specialty; // Remove specialty from user data
  delete userData.wilaya; // Remove wilaya from user data
  
  const user = await User.create(userData);
  
  // Create a patient profile for patients automatically
  if (user.role === 'patient') {
    await Patient.create({ user: user._id });
  }

  // If registering as doctor, create doctor profile with pending status
  if (user.role === 'doctor') {
    if (!specialtyId) {
      throw createApiError('Specialty is required for doctors', 400);
    }
    if (!wilayaId) {
      throw createApiError('Wilaya is required for doctors', 400);
    }

    await Doctor.create({
      user: user._id,
      specialty: specialtyId,
      wilaya: wilayaId,
      consultationPrice: 1000, // Default consultation price in DZD
      status: 'pending' // Doctor starts in pending approval state
    });
  }
  
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  await sendRegistrationEmail(user);
  return { user: await sanitizeUser(user), token, refreshToken };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw createApiError('Invalid credentials', 401);
  }

  if (user.role === 'doctor') {
    const doctorProfile = await Doctor.findOne({ user: user._id }).select('status');
    if (!doctorProfile || doctorProfile.status !== 'verified') {
      throw createApiError('Doctor account pending approval', 403);
    }
  }

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  return { user: await sanitizeUser(user), token, refreshToken };
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

const updateUserProfile = async (userId, data) => {
  const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'gender', 'avatar'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) updates[field] = data[field];
  });

  if (updates.email) {
    updates.email = updates.email.toLowerCase();
    const existingUser = await User.findOne({ email: updates.email, _id: { $ne: userId } });
    if (existingUser) {
      throw createApiError('Email already registered', 409);
    }
  }

  const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password');
  if (!user) throw createApiError('User not found', 404);
  return sanitizeUser(user);
};

module.exports = { register, login, refreshAuthToken, requestPasswordReset, resetPassword, updateUserProfile };
