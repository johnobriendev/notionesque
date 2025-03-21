// // src/components/modals/DeleteConfirmModal.tsx

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeDeleteConfirm } from '../../features/ui/uiSlice';
import { deleteTask, deleteTasks } from '../../features/tasks/tasksSlice';

const DeleteConfirmModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.ui.isDeleteConfirmOpen);
  const taskId = useAppSelector(state => state.ui.deletingTaskId);
  const deletingTaskIds = useAppSelector(state => state.ui.deletingTaskIds);
  
  if (!isOpen) return null;
  
  const handleClose = () => {
    dispatch(closeDeleteConfirm());
  };
  
  const handleDelete = () => {
    // If taskId is null and we have deletingTaskIds, it's a bulk delete
    if (!taskId && deletingTaskIds.length > 0) {
      dispatch(deleteTasks(deletingTaskIds));
    } else if (taskId) {
      dispatch(deleteTask(taskId));
    }
    
    handleClose();
  };

  const message = taskId
    ? "Are you sure you want to delete this task?"
    : `Are you sure you want to delete ${deletingTaskIds.length} tasks?`;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Confirm Deletion</h2>
        
        <p className="mb-6 text-gray-700">
          {message} This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;