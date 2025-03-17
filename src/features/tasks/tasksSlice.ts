//src/features/tasks/tasksSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import undoable, { includeAction } from 'redux-undo';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus, TaskPriority } from '../../types';

// Define the state structure for the tasks slice
interface TasksState {
  items: Task[]; // Array of all tasks
}

// Initial state when the application loads
const initialState: TasksState = {
  items: []
};

// Create the slice with reducers
export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Add a new task
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...action.payload,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      };
      state.items.push(newTask);
    },
    
    // Update an existing task
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Omit<Task, 'id' | 'createdAt'>> }>) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex(task => task.id === id);
      
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },
    
    // Delete a single task
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(task => task.id !== action.payload);
    },
    
    // Delete multiple tasks (for bulk actions)
    deleteTasks: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter(task => !action.payload.includes(task.id));
    },
    
    // Update task priority (used in Kanban view when dragging)
    updateTaskPriority: (state, action: PayloadAction<{ id: string; priority: TaskPriority }>) => {
      const { id, priority } = action.payload;
      const index = state.items.findIndex(task => task.id === id);
      
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          priority,
          updatedAt: new Date().toISOString()
        };
      }
    },
  }
});

// Actions to be included in undo history
const undoableActions = [
  'tasks/addTask',
  'tasks/updateTask',
  'tasks/deleteTask',
  'tasks/deleteTasks',
  'tasks/updateTaskPriority',
];

// Wrap the reducer with undoable
const undoableTasksReducer = undoable(tasksSlice.reducer, {
  filter: includeAction(undoableActions),
  limit: 20, // Limit the history to 20 steps
  debug: true, // Enable debug output
  syncFilter: true, // Prevent rehydration from creating a history entry
  clearHistoryType: '@@redux-undo/CLEAR_HISTORY' // Action type to clear history
});

// Export the actions
export const { 
  addTask, 
  updateTask, 
  deleteTask, 
  deleteTasks,
  updateTaskPriority,
} = tasksSlice.actions;

// Export the reducer
export default undoableTasksReducer;

// Selector to get all tasks
export const selectAllTasks = (state: any) => state.tasks.present.items;