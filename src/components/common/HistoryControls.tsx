import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ActionCreators } from 'redux-undo';

const HistoryControls: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Access the undo/redo state directly from redux-undo
  const canUndo = useAppSelector(state => state.tasks.past.length > 0);
  const canRedo = useAppSelector(state => state.tasks.future.length > 0);
  
  // Get counts for debugging and tooltips
  const pastCount = useAppSelector(state => state.tasks.past.length);
  const futureCount = useAppSelector(state => state.tasks.future.length);
  
  // Handle undo action
  const handleUndo = () => {
    if (canUndo) {
      dispatch(ActionCreators.undo());
    }
  };

  // Handle redo action
  const handleRedo = () => {
    if (canRedo) {
      dispatch(ActionCreators.redo());
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Undo Button with Curved Arrow Icon */}
      <button
        onClick={handleUndo}
        disabled={!canUndo}
        className={`p-2 rounded-md ${
          canUndo 
          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
        }`}
        title={`Undo (${pastCount} states in history)`}
        data-testid="undo-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6M3 10l6-6"/>
        </svg>
      </button>
      
      {/* Redo Button with Curved Arrow Icon */}
      <button
        onClick={handleRedo}
        disabled={!canRedo}
        className={`p-2 rounded-md ${
          canRedo 
          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
        }`}
        title={`Redo (${futureCount} states in future)`}
        data-testid="redo-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10H11a8 8 0 0 0-8 8v2M21 10l-6 6M21 10l-6-6"/>
        </svg>
      </button>
    </div>
  );
};

export default HistoryControls;