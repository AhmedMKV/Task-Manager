import TaskCard from './TaskCard';

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md">
        <p className="text-gray-500 text-lg">No tasks found</p>
        <p className="text-gray-400 text-sm mt-2">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
};

export default TaskList;


