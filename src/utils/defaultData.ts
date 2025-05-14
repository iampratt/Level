import { Task } from '../types';

export function getDefaultTasks(): Task[] {
  return [
    {
      id: '1',
      title: 'Morning Meditation',
      description: 'Start the day with a 10-minute meditation session',
      category: 'Health',
      created: new Date().toISOString(),
      isActive: true,
      duration: 0.5
    },
    {
      id: '2',
      title: 'Exercise',
      description: 'Complete a 30-minute workout session',
      category: 'Health',
      created: new Date().toISOString(),
      isActive: true,
      duration: 1
    },
    {
      id: '3',
      title: 'Read',
      description: 'Read for at least 20 minutes',
      category: 'Personal Development',
      created: new Date().toISOString(),
      isActive: true,
      duration: 1
    },
    {
      id: '4',
      title: 'Journal',
      description: 'Write in journal for 5 minutes',
      category: 'Personal Development',
      created: new Date().toISOString(),
      isActive: true,
      duration: 0.5
    },
    {
      id: '5',
      title: 'Drink Water',
      description: 'Drink at least 8 glasses of water',
      category: 'Health',
      created: new Date().toISOString(),
      isActive: true,
      duration: 0.25
    }
  ];
}