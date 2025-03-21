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

// Define payload types
interface ReorderTasksPayload {
  priority: TaskPriority;
  taskIds: string[];
}

// Enhanced payload for updateTaskPriority
interface UpdateTaskPriorityPayload {
  id: string;
  priority: TaskPriority;
  destinationIndex?: number; // Optional parameter for destination position
}

// Create the slice with reducers
export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Add a new task
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'position'>>) => {
      const now = new Date().toISOString();
      
      // Calculate the next position for the new task based on its priority
      const tasksWithSamePriority = state.items.filter(
        task => task.priority === action.payload.priority
      );
      
      // If no tasks with this priority, start at position 0, otherwise take the max position + 1
      const position = tasksWithSamePriority.length 
        ? Math.max(...tasksWithSamePriority.map(t => t.position || 0)) + 1 
        : 0;
      
      const newTask: Task = {
        ...action.payload,
        id: uuidv4(),
        position, // Set the position field
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
        const oldPriority = state.items[index].priority;
        const newPriority = updates.priority;
        
        // If priority changed, handle position updates
        if (newPriority && newPriority !== oldPriority) {
          // Get the highest position in the new priority group
          const tasksInNewPriority = state.items.filter(t => t.priority === newPriority);
          const newPosition = tasksInNewPriority.length 
            ? Math.max(...tasksInNewPriority.map(t => t.position || 0)) + 1 
            : 0;
          
          updates.position = newPosition;
        }
        
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
    
    // Enhanced: Update task priority with optional destination index
    updateTaskPriority: (state, action: PayloadAction<UpdateTaskPriorityPayload>) => {
      const { id, priority, destinationIndex } = action.payload;
      const index = state.items.findIndex(task => task.id === id);
      
      if (index !== -1) {
        const oldPriority = state.items[index].priority;
        
        // Only proceed if priority actually changed
        if (oldPriority !== priority) {
          let newPosition;
          
          // Get all tasks in the destination priority column
          const tasksInDestPriority = state.items.filter(t => t.priority === priority);
          
          if (destinationIndex !== undefined && tasksInDestPriority.length > 0) {
            // Sort tasks by position
            const sortedTasks = [...tasksInDestPriority].sort((a, b) => 
              (a.position || 0) - (b.position || 0)
            );
            
            if (destinationIndex >= sortedTasks.length) {
              // If dropped at the end, set position after the last task
              const maxPosition = Math.max(...sortedTasks.map(t => t.position || 0));
              newPosition = maxPosition + 1;
            } else {
              // If dropped in the middle, get the position at the drop point
              const positionAtDrop = sortedTasks[destinationIndex].position || 0;
              
              // Increment positions of all tasks at or after the drop point
              state.items.forEach(task => {
                if (
                  task.priority === priority && 
                  task.position !== undefined && 
                  task.position >= positionAtDrop
                ) {
                  task.position += 1;
                }
              });
              
              // Set the moved task to the position at the drop point
              newPosition = positionAtDrop;
            }
          } else {
            // Default: place at the end
            newPosition = tasksInDestPriority.length 
              ? Math.max(...tasksInDestPriority.map(t => t.position || 0)) + 1 
              : 0;
          }
          
          // Update the task with new priority and position
          state.items[index] = {
            ...state.items[index],
            priority,
            position: newPosition,
            updatedAt: new Date().toISOString()
          };
        }
      }
    },

    bulkUpdateTasks: (state, action: PayloadAction<{ 
      taskIds: string[]; 
      updates: Partial<Pick<Task, 'status' | 'priority'>> 
    }>) => {
      const { taskIds, updates } = action.payload;
      
      // If priority is changing, we need to handle positions
      if (updates.priority) {
        // Get all tasks in the destination priority
        const tasksInDestPriority = state.items.filter(t => t.priority === updates.priority);
        let nextPosition = tasksInDestPriority.length 
          ? Math.max(...tasksInDestPriority.map(t => t.position || 0)) + 1 
          : 0;
          
        // Update each task one by one to maintain proper positions
        state.items = state.items.map(task => {
          if (taskIds.includes(task.id)) {
            // If priority is changing, assign a new position
            const needsNewPosition = updates.priority && task.priority !== updates.priority;
            
            return {
              ...task,
              ...updates,
              position: needsNewPosition ? nextPosition++ : (task.position || 0),
              updatedAt: new Date().toISOString()
            };
          }
          return task;
        });
      } else {
        // No priority change, simpler update
        state.items = state.items.map(task => {
          if (taskIds.includes(task.id)) {
            return {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString()
            };
          }
          return task;
        });
      }
    },

    reorderTasks: (state, action: PayloadAction<ReorderTasksPayload>) => {
      const { priority, taskIds } = action.payload;
      
      // Update positions based on the new order
      taskIds.forEach((taskId, index) => {
        const taskIndex = state.items.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          state.items[taskIndex] = {
            ...state.items[taskIndex],
            position: index,
            updatedAt: new Date().toISOString()
          };
        }
      });
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
  'tasks/reorderTasks',
  'tasks/bulkUpdateTasks',
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
  reorderTasks,
  bulkUpdateTasks
} = tasksSlice.actions;

// Export the reducer
export default undoableTasksReducer;

// Selector to get all tasks
export const selectAllTasks = (state: any) => state.tasks.present.items;