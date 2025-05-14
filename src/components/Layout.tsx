import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  BarChart, 
  Settings as SettingsIcon, 
  ChevronRight, 
  Sun, 
  Moon,
  Edit
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
  showAdmin: boolean;
}

function Layout({ children, showAdmin }: LayoutProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  // Helper to check if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="md:w-64 bg-white dark:bg-secondary-800 shadow-sm md:shadow-md z-10">
        <div className="h-16 flex items-center justify-between px-4 border-b border-secondary-200 dark:border-secondary-700">
          <Link to="/" className="flex items-center space-x-2 font-semibold text-primary-600 dark:text-primary-400">
            <LayoutGrid size={20} />
            <span className="text-lg">LEVEL</span>
          </Link>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-secondary-400" />
            ) : (
              <Moon size={18} className="text-secondary-600" />
            )}
          </button>
        </div>
        <nav className="py-6 px-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/"
                className={`flex items-center px-3 py-2 rounded-lg group transition-colors ${
                  isActive('/')
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                }`}
              >
                <LayoutGrid 
                  size={18} 
                  className={`mr-3 ${
                    isActive('/') 
                      ? 'text-primary-500 dark:text-primary-400' 
                      : 'text-secondary-500 dark:text-secondary-400 group-hover:text-secondary-700 dark:group-hover:text-secondary-200'
                  }`} 
                />
                <span>Dashboard</span>
                {isActive('/') && (
                  <ChevronRight size={16} className="ml-auto text-primary-500 dark:text-primary-400" />
                )}
              </Link>
            </li>
            <li>
              <Link 
                to="/analytics"
                className={`flex items-center px-3 py-2 rounded-lg group transition-colors ${
                  isActive('/analytics')
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                }`}
              >
                <BarChart 
                  size={18} 
                  className={`mr-3 ${
                    isActive('/analytics') 
                      ? 'text-primary-500 dark:text-primary-400' 
                      : 'text-secondary-500 dark:text-secondary-400 group-hover:text-secondary-700 dark:group-hover:text-secondary-200'
                  }`} 
                />
                <span>Analytics</span>
                {isActive('/analytics') && (
                  <ChevronRight size={16} className="ml-auto text-primary-500 dark:text-primary-400" />
                )}
              </Link>
            </li>
            <li>
              <Link 
                to="/settings"
                className={`flex items-center px-3 py-2 rounded-lg group transition-colors ${
                  isActive('/settings')
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                }`}
              >
                <SettingsIcon 
                  size={18} 
                  className={`mr-3 ${
                    isActive('/settings') 
                      ? 'text-primary-500 dark:text-primary-400' 
                      : 'text-secondary-500 dark:text-secondary-400 group-hover:text-secondary-700 dark:group-hover:text-secondary-200'
                  }`} 
                />
                <span>Settings</span>
                {isActive('/settings') && (
                  <ChevronRight size={16} className="ml-auto text-primary-500 dark:text-primary-400" />
                )}
              </Link>
            </li>
            {showAdmin && (
              <li>
                <Link 
                  to="/admin"
                  className={`flex items-center px-3 py-2 rounded-lg group transition-colors ${
                    isActive('/admin')
                      ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400'
                      : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                  }`}
                >
                  <Edit 
                    size={18} 
                    className={`mr-3 ${
                      isActive('/admin') 
                        ? 'text-accent-500 dark:text-accent-400' 
                        : 'text-secondary-500 dark:text-secondary-400 group-hover:text-secondary-700 dark:group-hover:text-secondary-200'
                    }`} 
                  />
                  <span>Admin</span>
                  {isActive('/admin') && (
                    <ChevronRight size={16} className="ml-auto text-accent-500 dark:text-accent-400" />
                  )}
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="absolute bottom-4 left-4 right-4 md:hidden">
          <div className="text-xs text-secondary-500 dark:text-secondary-400 text-center">
            Use the Konami code to access the admin panel
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export default Layout;
