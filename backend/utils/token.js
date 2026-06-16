const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || '15m'
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });
};

module.exports = { generateToken, generateRefreshToken };
