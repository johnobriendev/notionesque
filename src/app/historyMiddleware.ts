import { Middleware } from '@reduxjs/toolkit';
import { recordState } from '../features/history/historySlice';

// List of action types that should trigger a history record
const recordableActions = [
  'tasks/addTask',
  'tasks/updateTask',
  'tasks/deleteTask',
  'tasks/deleteTasks',
  'tasks/updateTaskPriority',
];

// Middleware to record state for undo/redo
export const historyMiddleware: Middleware = store => next => action => {
  // Execute the action first
  const result = next(action);
  
  // If this is a recordable action, save the state before the next action
  if (recordableActions.includes(action.type)) {
    const currentTasks = store.getState().tasks.items;
    // Create a deep copy to prevent reference issues
    const tasksCopy = JSON.parse(JSON.stringify(currentTasks));
    store.dispatch(recordState(tasksCopy));
  }
  
  return result;
};