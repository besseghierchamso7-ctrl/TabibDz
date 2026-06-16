const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode === 200 ? HTTP_STATUS.INTERNAL_SERVER_ERROR : res.statusCode;
  let message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;
  let errors = null;

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.VALIDATION_ERROR;
    errors = Object.entries(err.errors).reduce((acc, [field, error]) => {
      acc[field] = error.message;
      return acc;
    }, {});
    message = 'Validation failed';
  }
  // MongoDB Duplicate Key Error
  else if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    errors = { [field]: message };
  }
  // Mongoose Cast Error
  else if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Invalid ${err.kind}`;
    errors = { [err.path]: message };
  }
  // JWT Errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token expired';
  }
  // Custom errors with statusCode
  else if (err.statusCode) {
    statusCode = err.statusCode;
  }

  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors) {
    response.errors = errors;
  }

  // Add stack trace in development mode
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
