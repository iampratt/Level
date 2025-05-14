import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ListChecks, AlertCircle } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';

function Dashboard() {
  const { tasks, todayRecord, toggleTaskCompletion } = useTasks();
  const [today] = useState(format(new Date(), 'EEEE, MMMM do'));
  
  // Get only active tasks
  const activeTasks = tasks.filter(task => task.isActive);
  
  // Get completion status for each task
  const taskCompletionStatus = activeTasks.map(task => {
    const completion = todayRecord.taskCompletions.find(c => c.taskId === task.id);
    return {
      task,
      completed: completion ? completion.completed : false
    };
  });
  
  // Split into completed and uncompleted tasks
  const completedTasks = taskCompletionStatus.filter(item => item.completed);
  const uncompletedTasks = taskCompletionStatus.filter(item => !item.completed);
  
  // Calculate progress
  const totalTasks = activeTasks.length;
  const completedTasksCount = completedTasks.length;
  const progress = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
          Today's Tasks
        </h1>
        <p className="mt-1 text-secondary-600 dark:text-secondary-400">
          {today}
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            Daily Progress
          </span>
          <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            {completedTasksCount} of {totalTasks} complete
          </span>
        </div>
        <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-2.5 rounded-full bg-primary-500"
          />
        </div>
      </div>
      
      {/* Task Lists */}
      <div className="space-y-4">
        {/* Uncompleted Tasks */}
        <h2 className="font-medium text-lg text-secondary-800 dark:text-secondary-200">
          Tasks to Complete
        </h2>
        
        {uncompletedTasks.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
            {uncompletedTasks.map(({ task, completed }) => (
              <TaskCard key={task.id} task={task} isCompleted={completed} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ListChecks size={24} className="text-secondary-500" />}
            title="All tasks completed!"
            description="Great job! You've completed all your tasks for today."
          />
        )}
        
        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <>
            <h2 className="font-medium text-lg text-secondary-800 dark:text-secondary-200 mt-8">
              Completed Tasks
            </h2>
            <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
              {completedTasks.map(({ task, completed }) => (
                <TaskCard key={task.id} task={task} isCompleted={completed} />
              ))}
            </div>
          </>
        )}
        
        {/* No Tasks at All */}
        {totalTasks === 0 && (
          <EmptyState
            icon={<AlertCircle size={24} className="text-secondary-500" />}
            title="No tasks available"
            description="Use the admin panel to add your first task."
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;