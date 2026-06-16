import { useContext, useCallback } from 'react';
import React from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook to use authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * Hook for common error handling patterns
 */
export const useErrorHandler = () => {
  const { setError } = useAuth();

  const handleError = useCallback((error, fallbackMessage = 'An error occurred') => {
    const message = 
      error?.response?.data?.message ||
      error?.response?.data?.errors?.[Object.keys(error.response.data.errors)[0]] ||
      error?.message ||
      fallbackMessage;
    
    setError(message);
    return message;
  }, [setError]);

  return { handleError };
};

/**
 * Hook for async operations with loading state
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = React.useState('idle');
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  const execute = React.useCallback(async (...args) => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      const result = await asyncFunction(...args);
      setStatus('success');
      setData(result);
      return result;
    } catch (err) {
      setStatus('error');
      setError(err);
      throw err;
    }
  }, [asyncFunction]);

  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
};

/**
 * Hook for form state management
 */
export const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = React.useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleBlur = React.useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  const handleSubmit = React.useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit]);

  const setFieldError = React.useCallback((field, error) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  const resetForm = React.useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
    resetForm,
    setValues
  };
};

/**
 * Hook for managing local storage
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = React.useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

/**
 * Hook for managing debounced values
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for previous value reference
 */
export const usePrevious = (value) => {
  const ref = React.useRef();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default {
  useAuth,
  useErrorHandler,
  useAsync,
  useForm,
  useLocalStorage,
  useDebounce,
  usePrevious
};
