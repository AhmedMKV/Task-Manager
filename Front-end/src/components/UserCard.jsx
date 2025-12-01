const UserCard = ({ user }) => {
  const getRoleBadgeColor = (role) => {
    if (role === 'ADMIN') {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
              <p className="text-sm text-gray-500">User ID: {user.id}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {user.roles && user.roles.map((role) => (
              <span
                key={role}
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                  role
                )}`}
              >
                {role}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <span className="font-semibold">Tasks:</span>
              <span className="text-blue-600 font-bold">{user.taskCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

