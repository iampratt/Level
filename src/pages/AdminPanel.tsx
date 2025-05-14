import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import TaskForm from '../components/TaskForm';
import EmptyState from '../components/EmptyState';

function AdminPanel() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const handleAddTask = (taskData: any) => {
    addTask(taskData);
    setShowAddForm(false);
  };
  
  const handleUpdateTask = (taskId: string, taskData: any) => {
    updateTask(taskId, taskData);
    setEditingTask(null);
  };
  
  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setDeleteConfirm(null);
  };
  
  const getTaskById = (taskId: string) => {
    return tasks.find(task => task.id === taskId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
          Admin Panel
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus size={18} className="mr-1" />
          Add Task
        </button>
      </div>
      
      <p className="text-secondary-600 dark:text-secondary-400 text-sm italic">
        This is the backdoor admin section where you can manage your tasks.
      </p>
      
      {/* Add Task Form */}
      {showAddForm && (
        <TaskForm 
          onSubmit={handleAddTask} 
          onCancel={() => setShowAddForm(false)} 
        />
      )}
      
      {/* Task List */}
      <div className="card">
        <h2 className="text-lg font-medium text-secondary-800 dark:text-secondary-100 mb-4">
          All Tasks
        </h2>
        
        {tasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full table-auto">
              <thead className="border-b border-secondary-200 dark:border-secondary-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                {tasks.map(task => (
                  <tr 
                    key={task.id}
                    className="hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-secondary-800 dark:text-secondary-100">
                          {task.title}
                        </div>
                        <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                          {task.description.substring(0, 50)}{task.description.length > 50 ? '...' : ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300">
                        {task.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        task.isActive 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                          : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-400'
                      }`}>
                        {task.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {editingTask === task.id ? (
                        <TaskForm 
                          initialValues={getTaskById(task.id)}
                          onSubmit={(data) => handleUpdateTask(task.id, data)}
                          onCancel={() => setEditingTask(null)}
                          submitLabel="Update Task"
                        />
                      ) : deleteConfirm === task.id ? (
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-sm text-secondary-600 dark:text-secondary-400">
                            Confirm delete?
                          </span>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="p-1 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingTask(task.id)}
                            className="p-1 text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            aria-label="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(task.id)}
                            className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            aria-label="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<AlertCircle size={24} className="text-secondary-500" />}
            title="No tasks defined"
            description="You haven't created any tasks yet. Add your first task to get started."
            action={
              <button
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary"
              >
                <Plus size={18} className="mr-1" />
                Add Your First Task
              </button>
            }
          />
        )}
      </div>
    </div>
  );
}

export default AdminPanel;