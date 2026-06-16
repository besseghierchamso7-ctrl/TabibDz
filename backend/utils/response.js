/**
 * Standardized API Response Utility
 * Provides consistent response formatting across all endpoints
 */

const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const sendError = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

const sendPaginatedSuccess = (res, data, total, page, limit, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginatedSuccess
};
