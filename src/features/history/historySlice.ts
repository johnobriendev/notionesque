//src/features/history/historySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';

// We'll track the tasks state history for undo/redo
interface HistoryState {
  past: Task[][];
  future: Task[][];
  // Flag to ignore the next state change (used when performing undo/redo)
  ignoreNextChange: boolean;
}

const initialState: HistoryState = {
  past: [],
  future: [],
  ignoreNextChange: false,
};

// Maximum number of actions to keep in history
const MAX_HISTORY_LENGTH = 20;

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    // Record the current state in history
    recordState: (state, action: PayloadAction<Task[]>) => {
      // If we should ignore this change, reset the flag and do nothing
      if (state.ignoreNextChange) {
        state.ignoreNextChange = false;
        return;
      }
      
      // Add the previous state to the past
      state.past.push(action.payload);
      
      // Limit the size of the history
      if (state.past.length > MAX_HISTORY_LENGTH) {
        state.past.shift(); // Remove the oldest state
      }
      
      // Clear the future when a new action is performed
      state.future = [];
    },
    
    // Undo the last action
    undo: (state) => {
      if (state.past.length === 0) return;
      
      // Get the last state from the past
      const previous = state.past.pop();
      
      // Set the ignoreNextChange flag to prevent recording the undo action
      state.ignoreNextChange = true;
      
      // Add the current state to the future
      if (previous) {
        state.future.push(previous);
      }
    },
    
    // Redo the last undone action
    redo: (state) => {
      if (state.future.length === 0) return;
      
      // Get the next state from the future
      const next = state.future.pop();
      
      // Set the ignoreNextChange flag to prevent recording the redo action
      state.ignoreNextChange = true;
      
      // Add the current state to the past
      if (next) {
        state.past.push(next);
      }
    },
    
    // Clear history (e.g. when resetting the app)
    clearHistory: (state) => {
      state.past = [];
      state.future = [];
      state.ignoreNextChange = false;
    },
  },
});

export const { recordState, undo, redo, clearHistory } = historySlice.actions;

// Selectors
export const selectCanUndo = (state: { history: HistoryState }) => state.history.past.length > 0;
export const selectCanRedo = (state: { history: HistoryState }) => state.history.future.length > 0;
export const selectPastState = (state: { history: HistoryState }) => {
  if (state.history.past.length === 0) return null;
  return state.history.past[state.history.past.length - 1];
};
export const selectFutureState = (state: { history: HistoryState }) => {
  if (state.history.future.length === 0) return null;
  return state.history.future[state.history.future.length - 1];
};

export default historySlice.reducer;