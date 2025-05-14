export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  created: string;
  isActive: boolean;
  duration: number; // Hours per day
}

export interface TaskCompletion {
  taskId: string;
  date: string; // ISO format YYYY-MM-DD
  completed: boolean;
}

export interface DailyRecord {
  date: string; // ISO format YYYY-MM-DD
  taskCompletions: TaskCompletion[];
}

export interface AnalyticsData {
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  taskPerformance: {
    taskId: string;
    title: string;
    completionRate: number;
  }[];
}