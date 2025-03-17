import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { undo, redo, selectCanUndo, selectCanRedo } from '../../features/history/historySlice';
import { setTasks } from '../../features/tasks/tasksSlice';

const HistoryControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);
  const pastState = useAppSelector(state => state.history.past.length > 0 ? 
    state.history.past[state.history.past.length - 1] : null);
  const futureState = useAppSelector(state => state.history.future.length > 0 ? 
    state.history.future[state.history.future.length - 1] : null);

  // Handle undo action
  const handleUndo = () => {
    if (!canUndo) return;
    
    if (pastState) {
      // Apply the past state to the tasks
      dispatch(setTasks(pastState));
    }
    
    // Record the undo in history
    dispatch(undo());
  };

  // Handle redo action
  const handleRedo = () => {
    if (!canRedo) return;
    
    if (futureState) {
      // Apply the future state to the tasks
      dispatch(setTasks(futureState));
    }
    
    // Record the redo in history
    dispatch(redo());
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleUndo}
        disabled={!canUndo}
        className={`p-2 rounded-md ${
          canUndo 
          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
        }`}
        title="Undo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        onClick={handleRedo}
        disabled={!canRedo}
        className={`p-2 rounded-md ${
          canRedo 
          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
        }`}
        title="Redo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default HistoryControls;