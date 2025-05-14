import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
}

function StatCard({ 
  title, 
  value, 
  icon, 
  change, 
  color = 'primary' 
}: StatCardProps) {
  const colorVariants = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-500 dark:text-primary-400',
    secondary: 'bg-secondary-100 dark:bg-secondary-800 text-secondary-500 dark:text-secondary-400',
    accent: 'bg-accent-50 dark:bg-accent-900/20 text-accent-500 dark:text-accent-400',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400',
    warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
            {title}
          </p>
          <h4 className="mt-2 text-3xl font-semibold text-secondary-900 dark:text-secondary-50">
            {value}
          </h4>
          
          {change && (
            <div className="mt-2 flex items-center">
              <span className={`text-sm font-medium ${
                change.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-xs text-secondary-500 dark:text-secondary-400 ml-1">
                from last week
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${colorVariants[color]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;