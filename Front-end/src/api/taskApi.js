import api from './axios';

/**
 * Get all tasks for the authenticated user
 * @returns {Promise} List of tasks
 */
export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

/**
 * Create a new task
 * @param {Object} taskData - { title, description }
 * @returns {Promise} Created task
 */
export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

/**
 * Update a task
 * @param {Number} id - Task ID
 * @param {Object} taskData - { title, description, completed }
 * @returns {Promise} Updated task
 */
export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

/**
 * Delete a task
 * @param {Number} id - Task ID
 * @returns {Promise} Empty response
 */
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

/**
 * Get task statistics
 * @returns {Promise} Task statistics
 */
export const getStatistics = async () => {
  const response = await api.get('/tasks/statistics');
  return response.data;
};


