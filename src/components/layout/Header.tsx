//src/components/layout/Header.tsx

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  setViewMode, 
  openTaskModal,
  setSearchTerm,
  setFilterStatus,
  setFilterPriority
} from '../../features/ui/uiSlice';
import { ViewMode, TaskStatus, TaskPriority } from '../../types';
import HistoryControls from '../common/HistoryControls';


const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(state => state.ui.viewMode);
  const filterConfig = useAppSelector(state => state.ui.filterConfig);
  
  // Handle view mode toggle
  const handleViewModeChange = (mode: ViewMode) => {
    dispatch(setViewMode(mode));
  };
  
  // Handle opening the create task modal
  const handleCreateTask = () => {
    dispatch(openTaskModal(null)); // null means we're creating a new task
  };
  
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };
  
  // Handle status filter changes
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilterStatus(e.target.value as TaskStatus | 'all'));
  };
  
  // Handle priority filter changes
  const handlePriorityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilterPriority(e.target.value as TaskPriority | 'all'));
  };
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
         
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-900 mr-4">
              Notionesque
            </h1>
            {/* Undo/Redo Controls */}
            <HistoryControls />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleCreateTask}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Task
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewModeChange('list')}
                className={`px-3 py-1 rounded-md ${
                  viewMode === 'list' 
                  ? 'bg-gray-200 text-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                List
              </button>
              <button
                onClick={() => handleViewModeChange('kanban')}
                className={`px-3 py-1 rounded-md ${
                  viewMode === 'kanban' 
                  ? 'bg-gray-200 text-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Kanban
              </button>
            </div>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="mt-4 flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search tasks..."
              value={filterConfig.searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          
          <div className="flex space-x-4">
            <select
              value={filterConfig.status}
              onChange={handleStatusFilterChange}
              className="px-4 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="not started">Not Started</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={filterConfig.priority}
              onChange={handlePriorityFilterChange}
              className="px-4 py-2 border rounded-md"
            >
              <option value="all">All Priorities</option>
              <option value="none">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;