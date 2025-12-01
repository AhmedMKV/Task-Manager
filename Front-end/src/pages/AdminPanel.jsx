import { useState, useEffect } from 'react';
import { getAllTasks, getAllUsers } from '../api/adminApi';
import TaskCard from '../components/TaskCard';
import UserCard from '../components/UserCard';
import StatsCard from '../components/StatsCard';
import { useToast } from '../context/ToastContext';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, tasks
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (activeTab === 'tasks' && tasks.length === 0) {
      loadTasks();
    } else if (activeTab === 'users' && users.length === 0) {
      loadUsers();
    }
  }, [activeTab]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [tasksData, usersData] = await Promise.all([
        getAllTasks(),
        getAllUsers(),
      ]);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Failed to load admin data. You may not have admin access.',
        'error'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      setTasksLoading(true);
      const data = await getAllTasks();
      setTasks(data);
    } catch (err) {
      showToast('Failed to load tasks', 'error');
      console.error(err);
    } finally {
      setTasksLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      showToast('Failed to load users', 'error');
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.completed).length,
    pendingTasks: tasks.filter((t) => !t.completed).length,
    adminUsers: users.filter((u) => u.roles?.includes('ADMIN')).length,
    regularUsers: users.filter((u) => !u.roles?.includes('ADMIN')).length,
  };

  const handleEdit = () => {
    showToast('To edit tasks, please go to the user\'s dashboard.', 'info');
  };

  const handleDelete = () => {
    showToast('To delete tasks, please go to the user\'s dashboard.', 'info');
  };

  const handleToggleComplete = () => {
    showToast('To toggle task completion, please go to the user\'s dashboard.', 'info');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage and monitor all users and tasks</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-4 font-semibold transition-colors ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Users ({stats.totalUsers})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-4 font-semibold transition-colors ${
              activeTab === 'tasks'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Tasks ({stats.totalTasks})
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon="👥"
              color="blue"
              subtitle={`${stats.adminUsers} admins, ${stats.regularUsers} users`}
            />
            <StatsCard
              title="Total Tasks"
              value={stats.totalTasks}
              icon="📋"
              color="purple"
              subtitle={`${stats.completedTasks} completed, ${stats.pendingTasks} pending`}
            />
            <StatsCard
              title="Completion Rate"
              value={`${stats.totalTasks > 0 ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(1) : 0}%`}
              icon="✅"
              color="green"
              subtitle={`${stats.completedTasks} of ${stats.totalTasks} tasks`}
            />
          </div>

          {/* Recent Users */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Users</h2>
            {users.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.slice(0, 6).map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </div>

          {/* Recent Tasks */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Tasks</h2>
            {tasks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-500">No tasks found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tasks.slice(0, 5).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
            <button
              onClick={loadUsers}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Refresh
            </button>
          </div>

          {usersLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">All Tasks</h2>
            <button
              onClick={loadTasks}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Refresh
            </button>
          </div>

          {tasksLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">No tasks found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
