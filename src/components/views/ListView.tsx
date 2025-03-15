//src/components/views/ListView.tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { openTaskModal } from '../../features/ui/uiSlice';
import { deleteTask } from '../../features/tasks/tasksSlice';
import { Task, SortField } from '../../types';

const ListView: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(state => state.tasks.items);
  const filterConfig = useAppSelector(state => state.ui.filterConfig);
  const sortConfig = useAppSelector(state => state.ui.sortConfig);
  
  // Filter and sort tasks based on current configuration
  const filteredAndSortedTasks = React.useMemo(() => {
    // First, filter the tasks
    let result = tasks.filter(task => {
      // Filter by status
      if (filterConfig.status !== 'all' && task.status !== filterConfig.status) {
        return false;
      }
      
      // Filter by priority
      if (filterConfig.priority !== 'all' && task.priority !== filterConfig.priority) {
        return false;
      }
      
      // Filter by search term
      if (filterConfig.searchTerm && !task.title.toLowerCase().includes(filterConfig.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
    
    // Then, sort the filtered tasks
    result.sort((a, b) => {
      const { field, direction } = sortConfig;
      const multiplier = direction === 'asc' ? 1 : -1;
      
      // Handle date fields
      if (field === 'createdAt' || field === 'updatedAt') {
        return multiplier * (new Date(a[field]).getTime() - new Date(b[field]).getTime());
      }
      
      // Handle string fields
      if (typeof a[field] === 'string' && typeof b[field] === 'string') {
        return multiplier * a[field].localeCompare(b[field] as string);
      }
      
      return 0;
    });
    
    return result;
  }, [tasks, filterConfig, sortConfig]);
  
  // Placeholder for the list view - we'll implement the actual table in a future step
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Task List</h2>
        
        {filteredAndSortedTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No tasks found. Create a new task to get started.
          </p>
        ) : (
          <p className="text-gray-700">
            Found {filteredAndSortedTasks.length} tasks. Full implementation coming in future commits.
          </p>
        )}
      </div>
    </div>
  );
};

export default ListView;