import { configureStore } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import tasksReducer from '../features/tasks/tasksSlice';
import uiReducer from '../features/ui/uiSlice';
import { store } from '../app/store';

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

// Create a makeStore function that returns a new store
export function makeStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: {
      tasks: tasksReducer as any,
      ui: uiReducer
    },
    preloadedState,
  });
}