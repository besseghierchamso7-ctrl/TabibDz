/**
 * Application Constants
 * Centralized configuration for magic strings and constants
 */

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500
};

const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient'
};

const DOCTOR_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
  CONFIRMED: 'confirmed',
  PENDING: 'pending'
};

const CONSULTATION_STATUS = {
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const PRESCRIPTION_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  FULFILLED: 'fulfilled'
};

const QUEUE_STATUS = {
  WAITING: 'waiting',
  SERVING: 'serving',
  COMPLETED: 'completed',
  NO_SHOW: 'no-show',
  CANCELLED: 'cancelled'
};

const WAITING_LIST_STATUS = {
  ACTIVE: 'active',
  RESERVED: 'reserved',
  EXPIRED: 'expired'
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

const SOCKET_EVENTS = {
  // Queue events
  QUEUE_UPDATED: 'queue:updated',
  QUEUE_PATIENT_ADDED: 'queue:patient-added',
  QUEUE_PATIENT_REMOVED: 'queue:patient-removed',
  QUEUE_STATUS_CHANGED: 'queue:status-changed',
  
  // Waiting list events
  WAITING_LIST_UPDATED: 'waitingList:updated',
  WAITING_LIST_SLOT_AVAILABLE: 'waitingList:slot-available',
  
  // Appointment events
  APPOINTMENT_CREATED: 'appointment:created',
  APPOINTMENT_UPDATED: 'appointment:updated',
  APPOINTMENT_CANCELLED: 'appointment:cancelled',
  
  // Notification events
  NOTIFICATION_RECEIVED: 'notification:received',
  
  // Connection events
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  ERROR: 'error'
};

const CACHE_DURATIONS = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 15 * 60, // 15 minutes
  LONG: 60 * 60, // 1 hour
  VERY_LONG: 24 * 60 * 60 // 24 hours
};

const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_FAILED: 'Validation failed',
  DUPLICATE_ENTRY: 'Duplicate entry found',
  INTERNAL_ERROR: 'Internal server error',
  DOCTOR_PENDING_APPROVAL: 'Doctor account pending approval',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_INACTIVE: 'Account is not active',
  OPERATION_NOT_ALLOWED: 'This operation is not allowed'
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  DOCTOR_STATUS,
  APPOINTMENT_STATUS,
  CONSULTATION_STATUS,
  PRESCRIPTION_STATUS,
  QUEUE_STATUS,
  WAITING_LIST_STATUS,
  PAGINATION,
  SOCKET_EVENTS,
  CACHE_DURATIONS,
  ERROR_MESSAGES
};
