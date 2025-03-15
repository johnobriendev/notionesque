//src/components/views/KanbanView.tsx

import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { TaskPriority } from '../../types';

const KanbanView: React.FC = () => {
  const tasks = useAppSelector(state => state.tasks.items);
  const filterConfig = useAppSelector(state => state.ui.filterConfig);
  
  // Filter tasks based on current configuration (not by priority since that's our column layout)
  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      // Filter by status
      if (filterConfig.status !== 'all' && task.status !== filterConfig.status) {
        return false;
      }
      
      // Filter by search term
      if (filterConfig.searchTerm && !task.title.toLowerCase().includes(filterConfig.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [tasks, filterConfig]);
  
  // Group tasks by priority for Kanban columns
  const tasksByPriority = React.useMemo(() => {
    const priorityOrder: TaskPriority[] = ['none', 'low', 'medium', 'high', 'urgent'];
    const grouped = priorityOrder.reduce((acc, priority) => {
      acc[priority] = filteredTasks.filter(task => task.priority === priority);
      return acc;
    }, {} as Record<TaskPriority, typeof filteredTasks>);
    
    return grouped;
  }, [filteredTasks]);
  
  // Get priority color class
  const getPriorityColorClass = (priority: TaskPriority): string => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 border-red-500';
      case 'high': return 'bg-orange-100 border-orange-500';
      case 'medium': return 'bg-yellow-100 border-yellow-500';
      case 'low': return 'bg-green-100 border-green-500';
      default: return 'bg-gray-100 border-gray-400';
    }
  };
  
  // Get formatted priority name
  const getPriorityName = (priority: TaskPriority): string => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };
  
  // Placeholder for the Kanban view - we'll implement the drag and drop in a future step
  return (
    <div className="h-full">
      <h2 className="text-xl font-semibold mb-4">Kanban Board</h2>
      
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {Object.entries(tasksByPriority).map(([priority, priorityTasks]) => (
          <div 
            key={priority}
            className={`flex-shrink-0 w-72 rounded-lg border-t-4 ${getPriorityColorClass(priority as TaskPriority)}`}
          >
            <div className="bg-white rounded-b-lg shadow p-4 h-full">
              <h3 className="font-medium mb-2">
                {getPriorityName(priority as TaskPriority)} ({priorityTasks.length})
              </h3>
              
              <div className="space-y-2">
                {priorityTasks.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No tasks
                  </p>
                ) : (
                  <p className="text-gray-700">
                    {priorityTasks.length} tasks. Full implementation coming in future commits.
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanView;