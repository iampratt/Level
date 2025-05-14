import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { format } from 'date-fns';
import { Task, TaskCompletion, DailyRecord, AnalyticsData } from '../types';
import { getDefaultTasks } from '../utils/defaultData';

interface TaskContextType {
  tasks: Task[];
  dailyRecords: DailyRecord[];
  todayRecord: DailyRecord;
  analyticsData: AnalyticsData;
  addTask: (task: Omit<Task, 'id' | 'created'>) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'created'>>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  refreshAnalytics: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<DailyRecord>({
    date: format(new Date(), 'yyyy-MM-dd'),
    taskCompletions: []
  });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    completionRate: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalCompletions: 0,
    taskPerformance: []
  });

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadedTasks = localStorage.getItem('tasks');
    const loadedRecords = localStorage.getItem('dailyRecords');
    
    if (loadedTasks) {
      setTasks(JSON.parse(loadedTasks));
    } else {
      // Set default tasks if none exist
      const defaultTasks = getDefaultTasks();
      setTasks(defaultTasks);
      localStorage.setItem('tasks', JSON.stringify(defaultTasks));
    }
    
    if (loadedRecords) {
      const parsedRecords = JSON.parse(loadedRecords) as DailyRecord[];
      setDailyRecords(parsedRecords);
      
      // Find or create today's record
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayRec = parsedRecords.find(record => record.date === today);
      
      if (todayRec) {
        setTodayRecord(todayRec);
      } else {
        const newTodayRecord = {
          date: today,
          taskCompletions: []
        };
        setTodayRecord(newTodayRecord);
        setDailyRecords(prev => [...prev, newTodayRecord]);
      }
    } else {
      // Initialize with today's empty record
      const newTodayRecord = {
        date: format(new Date(), 'yyyy-MM-dd'),
        taskCompletions: []
      };
      setTodayRecord(newTodayRecord);
      setDailyRecords([newTodayRecord]);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('dailyRecords', JSON.stringify(dailyRecords));
    
    // Recalculate analytics
    refreshAnalytics();
  }, [dailyRecords]);

  // Ensure today's record exists and is updated
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (todayRecord.date !== today) {
      const existingToday = dailyRecords.find(record => record.date === today);
      
      if (existingToday) {
        setTodayRecord(existingToday);
      } else {
        const newTodayRecord = {
          date: today,
          taskCompletions: []
        };
        setTodayRecord(newTodayRecord);
        setDailyRecords(prev => [...prev, newTodayRecord]);
      }
    }
  }, []);

  const refreshAnalytics = () => {
    // If no tasks or records, return default analytics
    if (tasks.length === 0 || dailyRecords.length === 0) {
      setAnalyticsData({
        completionRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        taskPerformance: []
      });
      return;
    }

    // Calculate total completions
    let totalCompletions = 0;
    dailyRecords.forEach(record => {
      record.taskCompletions.forEach(completion => {
        if (completion.completed) totalCompletions++;
      });
    });

    // Calculate completion rate
    const activeTasks = tasks.filter(task => task.isActive);
    const totalPossibleCompletions = activeTasks.length * dailyRecords.length;
    const completionRate = totalPossibleCompletions > 0 
      ? (totalCompletions / totalPossibleCompletions) * 100 
      : 0;

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Sort records by date descending
    const sortedRecords = [...dailyRecords].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    for (const record of sortedRecords) {
      // Check if all active tasks were completed
      const activeTaskIds = activeTasks.map(task => task.id);
      const allCompleted = activeTaskIds.every(taskId => {
        const completion = record.taskCompletions.find(c => c.taskId === taskId);
        return completion && completion.completed;
      });
      
      if (allCompleted) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        // Break only for current streak
        if (currentStreak === 0) {
          currentStreak = tempStreak;
        }
        tempStreak = 0;
      }
    }
    
    // If we never broke the streak, set current streak
    if (currentStreak === 0) {
      currentStreak = tempStreak;
    }
    
    // Calculate task performance
    const taskPerformance = tasks.map(task => {
      const taskCompletions = dailyRecords.flatMap(record => 
        record.taskCompletions.filter(c => c.taskId === task.id)
      );
      
      const completedCount = taskCompletions.filter(c => c.completed).length;
      const taskCompletionRate = taskCompletions.length > 0 
        ? (completedCount / taskCompletions.length) * 100 
        : 0;
      
      return {
        taskId: task.id,
        title: task.title,
        completionRate: taskCompletionRate
      };
    });

    setAnalyticsData({
      completionRate: Math.round(completionRate),
      currentStreak,
      longestStreak,
      totalCompletions,
      taskPerformance
    });
  };

  // Add a new task
  const addTask = (taskData: Omit<Task, 'id' | 'created'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      created: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, newTask]);
  };

  // Update an existing task
  const updateTask = (taskId: string, updates: Partial<Omit<Task, 'id' | 'created'>>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, ...updates } 
          : task
      )
    );
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    
    // Remove the task from all daily records
    setDailyRecords(prev => 
      prev.map(record => ({
        ...record,
        taskCompletions: record.taskCompletions.filter(
          completion => completion.taskId !== taskId
        )
      }))
    );
  };

  // Toggle task completion for today
  const toggleTaskCompletion = (taskId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Check if this task already has a completion record for today
    const existingCompletion = todayRecord.taskCompletions.find(
      completion => completion.taskId === taskId
    );
    
    let updatedTodayRecord: DailyRecord;
    
    if (existingCompletion) {
      // Toggle the existing completion
      updatedTodayRecord = {
        ...todayRecord,
        taskCompletions: todayRecord.taskCompletions.map(completion => 
          completion.taskId === taskId
            ? { ...completion, completed: !completion.completed }
            : completion
        )
      };
    } else {
      // Create a new completion record
      const newCompletion: TaskCompletion = {
        taskId,
        date: today,
        completed: true
      };
      
      updatedTodayRecord = {
        ...todayRecord,
        taskCompletions: [...todayRecord.taskCompletions, newCompletion]
      };
    }
    
    // Update today's record
    setTodayRecord(updatedTodayRecord);
    
    // Update the daily records array
    setDailyRecords(prev => 
      prev.map(record => 
        record.date === today ? updatedTodayRecord : record
      )
    );
  };

  return (
    <TaskContext.Provider 
      value={{
        tasks,
        dailyRecords,
        todayRecord,
        analyticsData,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        refreshAnalytics
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}