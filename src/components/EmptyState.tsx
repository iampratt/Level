import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="p-4 bg-secondary-100 dark:bg-secondary-800 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-secondary-800 dark:text-secondary-100 mb-2">
        {title}
      </h3>
      <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md">
        {description}
      </p>
      {action}
    </motion.div>
  );
}

export default EmptyState;