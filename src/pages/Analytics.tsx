import { useEffect, useState } from 'react';
import { 
  BarChart as BarChartIcon, 
  CheckCircle2, 
  CalendarDays, 
  TrendingUp, 
  Award,
  Clock 
} from 'lucide-react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTasks } from '../context/TaskContext';
import StatCard from '../components/StatCard';
import { format, subDays, parseISO } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const { tasks, dailyRecords, analyticsData, refreshAnalytics } = useTasks();
  const [chartData, setChartData] = useState<any>(null);
  const [trendsData, setTrendsData] = useState<any>(null);
  const [timeDistributionData, setTimeDistributionData] = useState<any>(null);

  useEffect(() => {
    // Ensure analytics data is up to date
    refreshAnalytics();
    
    if (tasks.length > 0) {
      // Prepare task performance data
      const sortedPerformance = [...analyticsData.taskPerformance]
        .sort((a, b) => b.completionRate - a.completionRate);
      
      const barData = {
        labels: sortedPerformance.map(item => item.title),
        datasets: [
          {
            label: 'Completion Rate %',
            data: sortedPerformance.map(item => item.completionRate),
            backgroundColor: 'rgba(14, 165, 233, 0.7)',
            borderColor: 'rgba(14, 165, 233, 1)',
            borderWidth: 1,
          },
        ],
      };
      setChartData(barData);
      
      // Calculate trends
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
        return date;
      });
      
      const dailyCompletionRates = last7Days.map(date => {
        const dayRecord = dailyRecords.find(record => record.date === date);
        if (!dayRecord) return 0;
        const activeTasks = tasks.filter(task => task.isActive);
        const totalTasks = activeTasks.length;
        if (totalTasks === 0) return 0;
        const completedTasks = dayRecord.taskCompletions.filter(c => c.completed).length;
        return (completedTasks / totalTasks) * 100;
      });
      
      const trendsChartData = {
        labels: last7Days.map(date => format(parseISO(date), 'EEE')),
        datasets: [
          {
            label: 'Completion Rate %',
            data: dailyCompletionRates,
            fill: true,
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            borderColor: 'rgba(14, 165, 233, 1)',
            tension: 0.3,
          },
        ],
      };
      setTrendsData(trendsChartData);

      // Calculate time distribution
      const activeTasks = tasks.filter(task => task.isActive);
      const totalHours = activeTasks.reduce((sum, task) => sum + task.duration, 0);
      const remainingHours = Math.max(0, 24 - totalHours);

      const timeData = {
        labels: [...activeTasks.map(task => task.title), 'Free Time'],
        datasets: [{
          data: [...activeTasks.map(task => task.duration), remainingHours],
          backgroundColor: [
            'rgba(14, 165, 233, 0.7)',
            'rgba(236, 72, 153, 0.7)',
            'rgba(34, 197, 94, 0.7)',
            'rgba(249, 115, 22, 0.7)',
            'rgba(168, 85, 247, 0.7)',
            'rgba(229, 231, 235, 0.7)'
          ],
          borderColor: [
            'rgba(14, 165, 233, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(249, 115, 22, 1)',
            'rgba(168, 85, 247, 1)',
            'rgba(229, 231, 235, 1)'
          ],
          borderWidth: 1
        }]
      };
      setTimeDistributionData(timeData);
    }
  }, [tasks, dailyRecords, analyticsData]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
        Analytics
      </h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Completion Rate" 
          value={`${analyticsData.completionRate}%`}
          icon={<BarChartIcon size={24} />}
          color="primary"
        />
        <StatCard 
          title="Current Streak" 
          value={analyticsData.currentStreak}
          icon={<TrendingUp size={24} />}
          color="accent"
        />
        <StatCard 
          title="Longest Streak" 
          value={analyticsData.longestStreak}
          icon={<Award size={24} />}
          color="success"
        />
        <StatCard 
          title="Total Completions" 
          value={analyticsData.totalCompletions}
          icon={<CheckCircle2 size={24} />}
          color="secondary"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Distribution Chart */}
        <div className="card p-4">
          <h2 className="text-lg font-medium text-secondary-800 dark:text-secondary-100 mb-4 flex items-center">
            <Clock size={20} className="mr-2" />
            Daily Time Distribution
          </h2>
          <div className="h-64">
            {timeDistributionData ? (
              <Pie 
                data={timeDistributionData}
                options={{
                  plugins: {
                    legend: {
                      position: 'right' as const,
                      labels: {
                        boxWidth: 12,
                        padding: 15
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const hours = context.raw as number;
                          return `${hours} hours`;
                        }
                      }
                    }
                  },
                  maintainAspectRatio: false,
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-secondary-500 dark:text-secondary-400">
                  No data available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Trends Chart */}
        <div className="card p-4">
          <h2 className="text-lg font-medium text-secondary-800 dark:text-secondary-100 mb-4">
            7-Day Trend
          </h2>
          <div className="h-64">
            {trendsData ? (
              <Line 
                data={trendsData} 
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      grid: {
                        display: true,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-secondary-500 dark:text-secondary-400">
                  No trend data available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Task Performance */}
      <div className="card p-4">
        <h2 className="text-lg font-medium text-secondary-800 dark:text-secondary-100 mb-4">
          Task Performance
        </h2>
        <div className="h-64">
          {chartData ? (
            <Bar 
              data={chartData} 
              options={{
                indexAxis: 'y' as const,
                scales: {
                  x: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-secondary-500 dark:text-secondary-400">
                No data available
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Task Insights */}
      <div className="card p-4">
        <h2 className="text-lg font-medium text-secondary-800 dark:text-secondary-100 mb-4">
          Insights
        </h2>
        
        <div className="space-y-4">
          {analyticsData.taskPerformance.length > 0 ? (
            <>
              <div>
                <h3 className="text-md font-medium text-secondary-700 dark:text-secondary-300">
                  Top Performing Tasks
                </h3>
                <ul className="mt-2 space-y-2">
                  {analyticsData.taskPerformance
                    .sort((a, b) => b.completionRate - a.completionRate)
                    .slice(0, 3)
                    .map(task => (
                      <li key={task.taskId} className="flex items-center justify-between py-2 border-b border-secondary-200 dark:border-secondary-700">
                        <span className="text-secondary-800 dark:text-secondary-200">{task.title}</span>
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {Math.round(task.completionRate)}% completion
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-secondary-700 dark:text-secondary-300">
                  Tasks Needing Attention
                </h3>
                <ul className="mt-2 space-y-2">
                  {analyticsData.taskPerformance
                    .sort((a, b) => a.completionRate - b.completionRate)
                    .slice(0, 3)
                    .map(task => (
                      <li key={task.taskId} className="flex items-center justify-between py-2 border-b border-secondary-200 dark:border-secondary-700">
                        <span className="text-secondary-800 dark:text-secondary-200">{task.title}</span>
                        <span className="text-sm font-medium text-accent-600 dark:text-accent-400">
                          {Math.round(task.completionRate)}% completion
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-secondary-500 dark:text-secondary-400">
              Complete some tasks to see insights here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;