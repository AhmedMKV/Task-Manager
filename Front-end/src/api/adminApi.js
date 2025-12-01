import api from './axios';

/**
 * Get all tasks (Admin only)
 * @returns {Promise} List of all tasks
 */
export const getAllTasks = async () => {
  const response = await api.get('/admin/tasks');
  return response.data;
};

/**
 * Get all users (Admin only)
 * @returns {Promise} List of all users
 */
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};


