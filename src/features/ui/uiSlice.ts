//src/features/ui/uiSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  ViewMode, 
  SortField, 
  SortDirection, 
  SortConfig,
  FilterConfig,
  TaskStatus, 
  TaskPriority 
} from '../../types';

// Define the state structure for the UI slice
interface UiState {
  viewMode: ViewMode;
  sortConfig: SortConfig;
  filterConfig: FilterConfig;
  isTaskModalOpen: boolean;
  editingTaskId: string | null;
  isTaskDetailOpen: boolean;
  viewingTaskId: string | null;
  isDeleteConfirmOpen: boolean;
  deletingTaskId: string | null;
  deletingTaskIds: string[],
  isBulkEditOpen: boolean;
  bulkEditType: 'status' | 'priority' | null;
  selectedTaskIds: string[];
  
}

// Initial state when the application loads
const initialState: UiState = {
  viewMode: 'list',
  sortConfig: {
    field: 'createdAt',
    direction: 'desc',
  },
  filterConfig: {
    status: 'all',
    priority: 'all',
    searchTerm: '',
  },
  isTaskModalOpen: false,
  editingTaskId: null,
  isTaskDetailOpen: false,
  viewingTaskId: null,
  isDeleteConfirmOpen: false,
  deletingTaskId: null,
  deletingTaskIds: [],
  isBulkEditOpen: false,
  bulkEditType: null,
  selectedTaskIds: []
};

// Create the slice with reducers
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toggle between list and kanban views
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    
    // Update the sort configuration
    setSortConfig: (state, action: PayloadAction<Partial<SortConfig>>) => {
      // If same field is clicked, toggle direction
      if (action.payload.field === state.sortConfig.field && !action.payload.direction) {
        state.sortConfig.direction = state.sortConfig.direction === 'asc' ? 'desc' : 'asc';
      } else {
        // Otherwise, update with new config
        state.sortConfig = {
          ...state.sortConfig,
          ...action.payload
        };
      }
    },
    
    // Update status filter
    setFilterStatus: (state, action: PayloadAction<TaskStatus | 'all'>) => {
      state.filterConfig.status = action.payload;
    },
    
    // Update priority filter
    setFilterPriority: (state, action: PayloadAction<TaskPriority | 'all'>) => {
      state.filterConfig.priority = action.payload;
    },
    
    // Update search term
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filterConfig.searchTerm = action.payload;
    },
    
    // Open task creation/edit modal
    openTaskModal: (state, action: PayloadAction<string | null>) => {
      state.isTaskModalOpen = true;
      state.editingTaskId = action.payload; // null for new task, task ID for editing
    },
    
    // Close task modal
    closeTaskModal: (state) => {
      state.isTaskModalOpen = false;
      state.editingTaskId = null;
    },

    // Open task detail view
    openTaskDetail: (state, action: PayloadAction<string>) => {
      state.isTaskDetailOpen = true;
      state.viewingTaskId = action.payload;
      // Close modal if open
      state.isTaskModalOpen = false;
      state.editingTaskId = null;
    },
    
    // Close task detail view
    closeTaskDetail: (state) => {
      state.isTaskDetailOpen = false;
      state.viewingTaskId = null;
    },

    openDeleteConfirm: (state, action: PayloadAction<string | string[]>) => {
      state.isDeleteConfirmOpen = true;
      
      if (Array.isArray(action.payload)) {
        state.deletingTaskId = null;
        state.deletingTaskIds = action.payload;
      } else {
        state.deletingTaskId = action.payload;
        state.deletingTaskIds = [];
      }
    },
    
    // Close delete confirmation modal
    closeDeleteConfirm: (state) => {
      state.isDeleteConfirmOpen = false;
      state.deletingTaskId = null;
      state.deletingTaskIds = [];
    },

    // Open bulk edit modal
    openBulkEdit: (state, action: PayloadAction<{
      type: 'status' | 'priority',
      taskIds: string[]
    }>) => {
      state.isBulkEditOpen = true;
      state.bulkEditType = action.payload.type;
      state.selectedTaskIds = action.payload.taskIds;
    },
    
    // Close bulk edit modal
    closeBulkEdit: (state) => {
      state.isBulkEditOpen = false;
      state.bulkEditType = null;
      // Don't clear selectedTaskIds to maintain selection after edit
    },

  }
});

// Export the actions
export const { 
  setViewMode, 
  setSortConfig, 
  setFilterStatus, 
  setFilterPriority, 
  setSearchTerm,
  openTaskModal,
  closeTaskModal,
  openTaskDetail,
  closeTaskDetail,
  openDeleteConfirm,
  closeDeleteConfirm,
  openBulkEdit,
  closeBulkEdit
} = uiSlice.actions;

// Export the reducer
export default uiSlice.reducer;

// Selectors
export const selectViewMode = (state: { ui: UiState }) => state.ui.viewMode;
export const selectSortConfig = (state: { ui: UiState }) => state.ui.sortConfig;
export const selectFilterConfig = (state: { ui: UiState }) => state.ui.filterConfig;
export const selectIsTaskModalOpen = (state: { ui: UiState }) => state.ui.isTaskModalOpen;
export const selectEditingTaskId = (state: { ui: UiState }) => state.ui.editingTaskId;
export const selectIsTaskDetailOpen = (state: { ui: UiState }) => state.ui.isTaskDetailOpen;
export const selectViewingTaskId = (state: { ui: UiState }) => state.ui.viewingTaskId;
export const selectIsDeleteConfirmOpen = (state: { ui: UiState }) => state.ui.isDeleteConfirmOpen;
export const selectDeletingTaskId = (state: { ui: UiState }) => state.ui.deletingTaskId;
export const selectIsBulkEditOpen = (state: { ui: UiState }) => state.ui.isBulkEditOpen;
export const selectBulkEditType = (state: { ui: UiState }) => state.ui.bulkEditType;
export const selectSelectedTaskIds = (state: { ui: UiState }) => state.ui.selectedTaskIds;