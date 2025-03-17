// src/utils/test-utils.tsx
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../features/tasks/tasksSlice';
import uiReducer from '../features/ui/uiSlice';
import { store } from '../app/store';

// Export store types
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

// Create a makeStore function that returns a new store
export function makeStore() {
  return configureStore({
    reducer: {
      tasks: tasksReducer as any,
      ui: uiReducer
    }
  });
}