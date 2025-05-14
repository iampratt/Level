import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  isCompleted: boolean;
}

function TaskCard({ task, isCompleted }: TaskCardProps) {
  const { toggleTaskCompletion } = useTasks();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleToggle = () => {
    toggleTaskCompletion(task.id);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="card group cursor-pointer"
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="transition-colors"
            initial={{ scale: 1 }}
            animate={{ 
              scale: isCompleted || isHovered ? 1.1 : 1,
              transition: { duration: 0.2 }
            }}
          >
            {isCompleted ? (
              <CheckCircle size={24} className="text-primary-500 dark:text-primary-400" />
            ) : (
              <Circle size={24} className={`${isHovered ? 'text-primary-400' : 'text-secondary-400 dark:text-secondary-500'}`} />
            )}
          </motion.div>
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-medium transition-colors ${isCompleted ? 'text-secondary-500 dark:text-secondary-400 line-through' : 'text-secondary-800 dark:text-secondary-100'}`}>
            {task.title}
          </h3>
          <p className={`mt-1 text-sm transition-colors ${isCompleted ? 'text-secondary-400 dark:text-secondary-500 line-through' : 'text-secondary-600 dark:text-secondary-300'}`}>
            {task.description}
          </p>
          <div className="mt-2">
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300">
              {task.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TaskCard;