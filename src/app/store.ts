//src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import tasksReducer from '../features/tasks/tasksSlice';
import uiReducer from '../features/ui/uiSlice';
import historyReducer from '../features/history/historySlice';


// Configuration for redux-persist
const tasksPersistConfig = {
  key: 'tasks',
  storage,
  whitelist: ['items'] // Only persist the items array
};

// Create the store with our reducers
export const store = configureStore({
  reducer: {
    tasks: persistReducer(tasksPersistConfig, tasksReducer),
    ui: uiReducer, // UI state doesn't need to be persisted
    history: historyReducer, // History doesn't need to be persisted
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializability check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create the persistor for the store
export const persistor = persistStore(store);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;