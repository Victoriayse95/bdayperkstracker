export default function TasksPage() {
  // Sample task data - in a real app, this would come from a database or API
  const tasks = [
    {
      id: 1,
      title: "Send reminder for Starbucks birthday perk",
      dueDate: "04/25/2023",
      status: "Pending",
      assignedTo: "Victoria",
      priority: "High"
    },
    {
      id: 2,
      title: "Update expired perks list",
      dueDate: "04/30/2023",
      status: "In Progress",
      assignedTo: "Victoria",
      priority: "Medium"
    },
    {
      id: 3,
      title: "Add new Dunkin' Donuts birthday offer",
      dueDate: "05/05/2023",
      status: "Not Started",
      assignedTo: "Admin",
      priority: "Low"
    }
  ];

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="my-6">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <p className="mt-2 text-gray-600">
          Manage upcoming tasks and reminders
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="w-1/3">
          <input
            type="text"
            placeholder="Search tasks..."
            className="px-3 py-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Add New Task
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow border border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Task
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Due Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Assigned To
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Priority
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {task.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.dueDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    task.status === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : task.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.assignedTo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    task.priority === 'High' 
                      ? 'bg-red-100 text-red-800' 
                      : task.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 