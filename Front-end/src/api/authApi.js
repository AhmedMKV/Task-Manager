import api from './axios';

/**
 * Register a new user
 * @param {Object} credentials - { username, password }
 * @returns {Promise} Response with token
 */
export const register = async (credentials) => {
  const response = await api.post('/auth/register', credentials);
  return response.data;
};

/**
 * Login user
 * @param {Object} credentials - { username, password }
 * @returns {Promise} Response with token
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};


