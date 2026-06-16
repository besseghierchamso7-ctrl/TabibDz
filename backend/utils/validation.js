/**
 * Input Validation Utility
 * Provides common validation patterns and middleware
 */

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validatePhoneNumber = (phone) => {
  // Algerian phone number format
  const phoneRegex = /^(?:\+213|0)[1-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

const validateMinLength = (value, min) => {
  return value && value.toString().length >= min;
};

const validateMaxLength = (value, max) => {
  return value && value.toString().length <= max;
};

const validateEnum = (value, allowedValues) => {
  return allowedValues.includes(value);
};

const validateAge = (age) => {
  const numAge = parseInt(age, 10);
  return numAge >= 18 && numAge <= 120;
};

const validateInput = (data, rules) => {
  const errors = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];

    for (const rule of fieldRules) {
      const { type, min, max, enum: enumValues, message } = rule;

      switch (type) {
        case 'required':
          if (!validateRequired(value)) {
            errors[field] = message || `${field} is required`;
          }
          break;
        case 'email':
          if (value && !validateEmail(value)) {
            errors[field] = message || 'Invalid email format';
          }
          break;
        case 'password':
          if (value && !validatePassword(value)) {
            errors[field] = message || 'Password must be at least 8 chars with uppercase, lowercase, number, and special character';
          }
          break;
        case 'phone':
          if (value && !validatePhoneNumber(value)) {
            errors[field] = message || 'Invalid phone number format';
          }
          break;
        case 'minLength':
          if (value && !validateMinLength(value, min)) {
            errors[field] = message || `${field} must be at least ${min} characters`;
          }
          break;
        case 'maxLength':
          if (value && !validateMaxLength(value, max)) {
            errors[field] = message || `${field} must not exceed ${max} characters`;
          }
          break;
        case 'enum':
          if (value && !validateEnum(value, enumValues)) {
            errors[field] = message || `${field} must be one of: ${enumValues.join(', ')}`;
          }
          break;
        case 'age':
          if (value && !validateAge(value)) {
            errors[field] = message || 'Age must be between 18 and 120';
          }
          break;
        default:
          break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateEnum,
  validateAge,
  validateInput
};
