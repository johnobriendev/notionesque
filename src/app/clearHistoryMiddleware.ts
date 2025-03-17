//src/app/clearHistoryMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { ActionCreators } from 'redux-undo';

// Middleware to clear history after rehydration
export const clearHistoryMiddleware: Middleware = store => next => action => {
  // Execute the action first
  const result = next(action);
  
  // If this is the REHYDRATE action from redux-persist
  if (action.type === 'persist/REHYDRATE') {
    // Clear the history after a short delay to ensure rehydration is complete
    setTimeout(() => {
      store.dispatch(ActionCreators.clearHistory());
    }, 100);
  }
  
  return result;
};