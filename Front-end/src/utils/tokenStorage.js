/**
 * Save JWT token to localStorage
 * @param {String} token - JWT token
 */
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Get JWT token from localStorage
 * @returns {String|null} JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Check if user is authenticated
 * @returns {Boolean} True if token exists
 */
export const isAuthenticated = () => {
  return !!getToken();
};


