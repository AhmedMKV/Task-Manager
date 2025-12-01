import { useState, useEffect, useMemo } from 'react';
import { getTasks, createTask, updateTask, deleteTask, getStatistics } from '../api/taskApi';
import TaskCard from '../components/TaskCard';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import StatsCard from '../components/StatsCard';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: '',
    sortBy: 'created',
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: '',
    dueDate: '',
  });
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, searchTerm, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, statsData] = await Promise.all([
        getTasks(),
        getStatistics(),
      ]);
      setTasks(tasksData);
      setStatistics(statsData);
    } catch (err) {
      showToast('Failed to load tasks', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTasks = () => {
    let filtered = [...tasks];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (filters.status === 'completed') {
      filtered = filtered.filter((task) => task.completed);
    } else if (filters.status === 'pending') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (filters.status === 'overdue') {
      filtered = filtered.filter(
        (task) =>
          !task.completed &&
          task.dueDate &&
          new Date(task.dueDate) < new Date()
      );
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (task) =>
          task.category &&
          task.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'due':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...newTask,
        dueDate: newTask.dueDate
          ? new Date(newTask.dueDate).toISOString()
          : null,
      };
      const created = await createTask(taskData);
      setTasks([...tasks, created]);
      setNewTask({
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: '',
        dueDate: '',
      });
      setShowModal(false);
      showToast('Task created successfully!', 'success');
      loadData(); // Reload to get updated statistics
    } catch (err) {
      showToast('Failed to create task', 'error');
      console.error(err);
    }
  };

  const handleEditTask = async (id, taskData) => {
    try {
      const updatedData = {
        ...taskData,
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : null,
      };
      const updated = await updateTask(id, updatedData);
      setTasks(tasks.map((task) => (task.id === id ? updated : task)));
      showToast('Task updated successfully!', 'success');
      loadData(); // Reload to get updated statistics
    } catch (err) {
      showToast('Failed to update task', 'error');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      showToast('Task deleted successfully!', 'success');
      loadData(); // Reload to get updated statistics
    } catch (err) {
      showToast('Failed to delete task', 'error');
      console.error(err);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        await handleEditTask(id, {
          title: task.title,
          description: task.description,
          priority: task.priority,
          category: task.category,
          dueDate: task.dueDate,
          completed,
        });
      }
    } catch (err) {
      showToast('Failed to update task', 'error');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Tasks</h1>
          <p className="text-gray-600">Manage and organize your tasks efficiently</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg font-semibold flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add New Task</span>
        </button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Tasks"
            value={statistics.total || 0}
            icon="📋"
            color="blue"
          />
          <StatsCard
            title="Completed"
            value={statistics.completed || 0}
            icon="✅"
            color="green"
            subtitle={`${statistics.completionRate?.toFixed(1) || 0}% completion rate`}
          />
          <StatsCard
            title="Pending"
            value={statistics.pending || 0}
            icon="⏳"
            color="yellow"
          />
          <StatsCard
            title="Overdue"
            value={statistics.overdue || 0}
            icon="⚠️"
            color="red"
          />
        </div>
      )}

      {/* Search and Filters */}
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500 text-lg">No tasks found</p>
          <p className="text-gray-400 text-sm mt-2">
            {tasks.length === 0
              ? 'Create your first task to get started!'
              : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Enter task description (optional)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newTask.category}
                    onChange={(e) =>
                      setNewTask({ ...newTask, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Work, Personal, Shopping"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNewTask({
                      title: '',
                      description: '',
                      priority: 'MEDIUM',
                      category: '',
                      dueDate: '',
                    });
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
