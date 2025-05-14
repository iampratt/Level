import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Trash2, Download, Upload } from 'lucide-react';

function Settings() {
  const { dailyRecords, refreshAnalytics } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const [confirmReset, setConfirmReset] = useState(false);
  const [exportData, setExportData] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  
  const handleResetData = () => {
    // Clear all localStorage data
    localStorage.removeItem('tasks');
    localStorage.removeItem('dailyRecords');
    
    // Reload the page to reset the app state
    window.location.reload();
  };
  
  const handleExportData = () => {
    try {
      const tasks = localStorage.getItem('tasks');
      const records = localStorage.getItem('dailyRecords');
      
      const exportObject = {
        tasks: tasks ? JSON.parse(tasks) : [],
        dailyRecords: records ? JSON.parse(records) : [],
        exportDate: new Date().toISOString()
      };
      
      const exportString = JSON.stringify(exportObject, null, 2);
      setExportData(exportString);
      
      // Create an invisible download link
      const blob = new Blob([exportString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `task-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };
  
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportSuccess(false);
    setImportError(null);
    
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Validate data structure
        if (!importedData.tasks || !Array.isArray(importedData.tasks)) {
          throw new Error('Invalid data format: tasks array missing');
        }
        
        if (!importedData.dailyRecords || !Array.isArray(importedData.dailyRecords)) {
          throw new Error('Invalid data format: dailyRecords array missing');
        }
        
        // Import the data
        localStorage.setItem('tasks', JSON.stringify(importedData.tasks));
        localStorage.setItem('dailyRecords', JSON.stringify(importedData.dailyRecords));
        
        setImportSuccess(true);
        
        // Refresh analytics with new data
        refreshAnalytics();
        
        // Clear file input
        event.target.value = '';
        
        // Reload after 1.5 seconds to apply changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error('Import failed:', error);
        setImportError(error instanceof Error ? error.message : 'Import failed');
        // Clear file input
        event.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
        Settings
      </h1>
      
      <div className="grid gap-6">
        {/* Theme Toggle */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-medium text-secondary-800 dark:text-secondary-100 mb-4">
            Appearance
          </h2>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-secondary-800 dark:text-secondary-100">
                  Theme
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                  Choose between light and dark mode
                </p>
              </div>
              <div className="flex items-center p-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`p-2 rounded ${
                    theme === 'light' 
                      ? 'bg-white dark:bg-secondary-700 shadow-sm' 
                      : 'text-secondary-500'
                  }`}
                  aria-label="Light mode"
                >
                  <Sun size={18} />
                </button>
                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`p-2 rounded ${
                    theme === 'dark' 
                      ? 'bg-secondary-700 shadow-sm' 
                      : 'text-secondary-500'
                  }`}
                  aria-label="Dark mode"
                >
                  <Moon size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Data Export/Import */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-lg font-medium text-secondary-800 dark:text-secondary-100 mb-4">
            Data Management
          </h2>
          <div className="space-y-4">
            <div className="pb-4 border-b border-secondary-200 dark:border-secondary-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-secondary-800 dark:text-secondary-100">
                    Export Data
                  </p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                    Download all your task data as a JSON file
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className="btn btn-secondary flex items-center"
                >
                  <Upload size={16} className="mr-1" />
                  Export
                </button>
              </div>
            </div>
            
            <div className="pb-4 border-b border-secondary-200 dark:border-secondary-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-secondary-800 dark:text-secondary-100">
                    Import Data
                  </p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                    Restore your data from a backup file
                  </p>
                  
                  {importSuccess && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      Data imported successfully! Reloading...
                    </p>
                  )}
                  
                  {importError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      Error: {importError}
                    </p>
                  )}
                </div>
                <div>
                  <label className="btn btn-secondary flex items-center cursor-pointer">
                    <Download size={16} className="mr-1" />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-secondary-800 dark:text-secondary-100">
                    Reset All Data
                  </p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                    Clear all tasks and history (cannot be undone)
                  </p>
                </div>
                {confirmReset ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-red-600 dark:text-red-400">
                      Are you sure?
                    </span>
                    <button
                      onClick={handleResetData}
                      className="btn bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 text-sm px-3 py-1"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setConfirmReset(false)}
                      className="btn btn-secondary text-sm px-3 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="btn bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Stats */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-lg font-medium text-secondary-800 dark:text-secondary-100 mb-4">
            Application Info
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600 dark:text-secondary-400">Days Tracked</span>
              <span className="font-medium text-secondary-800 dark:text-secondary-100">
                {dailyRecords.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600 dark:text-secondary-400">App Version</span>
              <span className="font-medium text-secondary-800 dark:text-secondary-100">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600 dark:text-secondary-400">Last Updated</span>
              <span className="font-medium text-secondary-800 dark:text-secondary-100">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Settings;