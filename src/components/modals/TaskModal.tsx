//src/components/modals/TaskModal.tsx
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeTaskModal } from '../../features/ui/uiSlice';
import { addTask, updateTask } from '../../features/tasks/tasksSlice';
import { Task, TaskStatus, TaskPriority } from '../../types';

const TaskModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.ui.isTaskModalOpen);
  const editingTaskId = useAppSelector(state => state.ui.editingTaskId);
  const tasks = useAppSelector(state => state.tasks.present.items as Task[]);
  
  // Find the task being edited, if any
  const taskToEdit = editingTaskId 
    ? tasks.find(task => task.id === editingTaskId) 
    : null;
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('not started');
  const [priority, setPriority] = useState<TaskPriority>('none');
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  
  // For adding custom fields
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  
  // Reset form when modal opens/closes or editingTaskId changes
  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        // Editing existing task - populate form
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setStatus(taskToEdit.status);
        setPriority(taskToEdit.priority);
        setCustomFields(taskToEdit.customFields as Record<string, string>);
        setShowCustomFields(Object.keys(taskToEdit.customFields).length > 0);
      } else {
        // Creating new task - reset form
        setTitle('');
        setDescription('');
        setStatus('not started');
        setPriority('none');
        setCustomFields({});
        setShowCustomFields(false);
      }
    }
  }, [isOpen, taskToEdit]);
  
  // Close the modal
  const handleClose = () => {
    dispatch(closeTaskModal());
  };
  
  // Submit the form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return; // Validate title
    
    if (taskToEdit) {
      // Update existing task
      dispatch(updateTask({
        id: taskToEdit.id,
        updates: {
          title,
          description,
          status,
          priority,
          customFields
        }
      }));
    } else {
      // Create new task
      dispatch(addTask({
        title,
        description,
        status,
        priority,
        customFields
      }));
    }
    
    // Close the modal
    handleClose();
  };
  
  // Add a custom field
  const handleAddCustomField = () => {
    if (newFieldName.trim() && newFieldValue.trim()) {
      setCustomFields(prev => ({
        ...prev,
        [newFieldName.trim()]: newFieldValue.trim()
      }));
      setNewFieldName('');
      setNewFieldValue('');
    }
  };
  
  // Remove a custom field
  const handleRemoveCustomField = (fieldName: string) => {
    setCustomFields(prev => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  // Toggle custom fields visibility
  const toggleCustomFields = () => {
    setShowCustomFields(!showCustomFields);
  };
  
  // If modal is closed, don't render anything
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        // Only close if the click is on the backdrop, not on the modal itself
        if (e.target === e.currentTarget) {
          dispatch(closeTaskModal());
        }
      }}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {taskToEdit ? 'Edit Task' : 'Create New Task'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* Task Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Task Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="not started">Not Started</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          {/* Custom Fields Collapsible Section */}
          <div className="mb-4 border rounded-md overflow-hidden">
            <button
              type="button"
              onClick={toggleCustomFields}
              className="w-full px-4 py-2 bg-gray-50 text-left flex justify-between items-center focus:outline-none"
            >
              <span className="font-medium text-gray-700">
                Custom Fields {Object.keys(customFields).length > 0 && `(${Object.keys(customFields).length})`}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform ${showCustomFields ? 'transform rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Collapsible content */}
            {showCustomFields && (
              <div className="p-4 border-t">
                {/* List existing custom fields */}
                {Object.entries(customFields).length > 0 && (
                  <div className="mb-4 bg-gray-50 rounded-md p-3">
                    {Object.entries(customFields).map(([name, value]) => (
                      <div key={name} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex flex-col mr-2 overflow-hidden">
                          <span className="font-medium text-sm text-gray-800">{name}</span>
                          <span className="text-gray-600 truncate">{value}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomField(name)}
                          className="text-red-600 hover:text-red-800 text-sm px-2 py-1 flex-shrink-0"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add new custom field - using vertical layout for more space */}
                <div className="mt-3">
                  <div className="flex flex-col space-y-2">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Due Date, Assigned To, URL"
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field Value</label>
                      <input
                        type="text"
                        placeholder="e.g., 2023-12-31, John Doe, https://example.com"
                        value={newFieldValue}
                        onChange={(e) => setNewFieldValue(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomField}
                    disabled={!newFieldName.trim() || !newFieldValue.trim()}
                    className={`mt-3 w-full px-4 py-2 rounded-md transition-colors ${
                      !newFieldName.trim() || !newFieldValue.trim()
                        ? 'bg-blue-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Add Field
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {taskToEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;