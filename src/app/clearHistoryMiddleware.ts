//src/app/clearHistoryMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { ActionCreators } from 'redux-undo';

// Middleware to clear history after rehydration
export const clearHistoryMiddleware: Middleware = store => next => action => {
  // Execute the action first
  const result = next(action);
  
  // Check if the action has a type property and if it's the REHYDRATE action
  if (typeof action === 'object' && action !== null && 'type' in action && action.type === 'persist/REHYDRATE') {
    // Clear the history after a short delay to ensure rehydration is complete
    setTimeout(() => {
      store.dispatch(ActionCreators.clearHistory());
    }, 100);
  }
  
  return result;
};