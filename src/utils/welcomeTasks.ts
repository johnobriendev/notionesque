import { TaskPriority, TaskStatus } from '../types';

/**
 * Returns a set of welcome tasks for new users
 * @returns Array of sample tasks with required fields for addTask action
 */
export const getWelcomeTasks = () => {
  return [
    
    {
      title: '🔍 Try filtering and searching',
      description: 'Use the filters and search bar to quickly find the tasks you need.',
      status: 'not started' as TaskStatus,
      priority: 'urgent' as TaskPriority,
      customFields: { 
        "Example custom field": "You can add custom fields to tasks!" 
      } as Record<string, string | number | boolean>
    },

    {
        title: '✏️ Quick-add tasks in any column',
        description: 'Use the "+ Add task" button at the bottom of any column to quickly create tasks with that priority level.',
        status: 'not started' as TaskStatus,
        priority: 'high' as TaskPriority,
        customFields: {} as Record<string, string | number | boolean>
    },

    {
      title: '⭐ Create your first task',
      description: 'Try creating a new task with the "+ Add task" button below or using the "New Task" button in the header.',
      status: 'not started' as TaskStatus,
      priority: 'medium' as TaskPriority,
      customFields: {} as Record<string, string | number | boolean>
    },

    {
        title: '🗂️ Switch between List and Kanban views',
        description: 'Use the view selector in the header to switch between different ways of organizing your tasks.',
        status: 'not started' as TaskStatus,
        priority: 'low' as TaskPriority,
        customFields: {} as Record<string, string | number | boolean>
    },

    {
        title: '👋 Welcome to Notionesque!',
        description: 'This is your new task management app. Here are a few tips to get you started:\n\n• Tasks can be organized by priority (columns) and status\n• Drag tasks between columns to change priority\n• Drag within a column to reorder tasks\n• Click on a task to view details',
        status: 'not started' as TaskStatus,
        priority: 'none' as TaskPriority,
        customFields: {} as Record<string, string | number | boolean>
     },
  ];
};