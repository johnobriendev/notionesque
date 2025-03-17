//src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import tasksReducer from '../features/tasks/tasksSlice';
import uiReducer from '../features/ui/uiSlice';
import { clearHistoryMiddleware } from './clearHistoryMiddleware';
import { RootState } from '../types';



// Configuration for redux-persist with redux-undo
const tasksPersistConfig = {
  key: 'tasks',
  storage,
  whitelist: ['present'] // Only persist the present state for tasks with redux-undo
};

// Create the store with our reducers
export const store = configureStore({
  reducer: {
    tasks: persistReducer(tasksPersistConfig, tasksReducer) as any,
    ui: uiReducer, // UI state doesn't need to be persisted
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializability check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(clearHistoryMiddleware),
});

// Create the persistor for the store
export const persistor = persistStore(store);

// Export types for TypeScript
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;