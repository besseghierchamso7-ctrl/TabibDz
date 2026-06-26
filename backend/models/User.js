const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, maxlength: 50 },
  lastName: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 100 },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['patient', 'doctor', 'admin', 'clinic_manager'], default: 'patient' },
  phone: { type: String, trim: true, maxlength: 20 },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false },
  refreshToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
