import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { openDeleteConfirm, openTaskModal } from '../../features/ui/uiSlice';
import { deleteTask } from '../../features/tasks/tasksSlice';
import { Task, TaskStatus, TaskPriority } from '../../types';

interface TaskDetailViewProps {
  task: Task;
  onClose: () => void;
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task, onClose }) => {
  const dispatch = useAppDispatch();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Handle edit task
  const handleEdit = () => {
    dispatch(openTaskModal(task.id));
    onClose(); // Close the detail view
  };
  
  // Handle delete task
  const handleDelete = () => {
    dispatch(openDeleteConfirm(task.id))
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get priority badge class
  const getPriorityBadgeClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        // Only close if the click is on the backdrop, not on the modal itself
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(task.status)}`}>
                {task.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadgeClass(task.priority)}`}>
                {task.priority !== 'none' ? task.priority : 'No priority'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
              <div>
                <span className="font-medium">Created:</span> {formatDate(task.createdAt)}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {formatDate(task.updatedAt)}
              </div>
            </div>
          </div>
          
          {/* Description */}
          {task.description && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <div className="bg-gray-50 rounded-md p-4 whitespace-pre-wrap">{task.description}</div>
            </div>
          )}
          
          {/* Custom Fields */}
          {Object.keys(task.customFields).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Custom Fields</h3>
              <div className="bg-gray-50 rounded-md p-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(task.customFields).map(([key, value]) => (
                    <div key={key} className="col-span-1">
                      <dt className="font-medium text-gray-700">{key}</dt>
                      <dd className="text-gray-900 mt-1">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer with actions */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailView;