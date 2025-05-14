import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Task } from '../types';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'created'>) => void;
  onCancel: () => void;
  initialValues?: Partial<Task>;
  submitLabel?: string;
}

function TaskForm({ 
  onSubmit, 
  onCancel, 
  initialValues = {}, 
  submitLabel = 'Add Task' 
}: TaskFormProps) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [category, setCategory] = useState(initialValues.category || '');
  const [duration, setDuration] = useState(initialValues.duration || 0.5);
  const [isActive, setIsActive] = useState(
    initialValues.isActive !== undefined ? initialValues.isActive : true
  );
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      title,
      description,
      category,
      isActive,
      duration
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setDuration(0.5);
    setIsActive(true);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">{initialValues.id ? 'Edit Task' : 'New Task'}</h3>
        <button 
          type="button"
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
        >
          <X size={18} className="text-secondary-500 dark:text-secondary-400" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="Task title"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input min-h-[100px]"
              placeholder="Task description"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
              placeholder="E.g., Health, Work, Personal"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Duration (hours)
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="input"
              placeholder="Task duration in hours"
              step="0.25"
              min="0.25"
              max="24"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-primary-600 border-secondary-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
              Active (show in daily tasks)
            </label>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default TaskForm;