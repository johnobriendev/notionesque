//src/app.tsx

import React, { useEffect} from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import Header from './components/layout/Header';
import ListView from './components/views/ListView';
import KanbanView from './components/views/KanbanView';
import TaskModal from './components/modals/TaskModal';
import BulkEditModal from './components/modals/BulkEditModal';
import DeleteConfirmModal from './components/modals/DeleteConfirmModal';
import TaskDetailView from './components/task/TaskDetailVIew';
import { closeTaskDetail } from './features/ui/uiSlice';
import { addTask } from './features/tasks/tasksSlice';
import { getWelcomeTasks } from './utils/welcomeTasks';

function App() {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(state => state.ui.viewMode);
  const isTaskDetailOpen = useAppSelector(state => state.ui.isTaskDetailOpen);
  const viewingTaskId = useAppSelector(state => state.ui.viewingTaskId);
  const tasks = useAppSelector(state => state.tasks.present.items);

  // Find the task being viewed, if any
  const taskBeingViewed = viewingTaskId 
    ? tasks.find(task => task.id === viewingTaskId) 
    : null;


  // Add welcome tasks if no tasks exist
  useEffect(() => {
    if (tasks.length === 0) {
      const welcomeTasks = getWelcomeTasks();
      welcomeTasks.forEach(task => {
        dispatch(addTask(task));
      });
      console.log('Welcome tasks added!');
    }
  }, [dispatch, tasks.length]);

  
  return (
    <div className="min-h-screen bg-gray-100 ">
      <Header />
      
      <main>
        <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 ">
          {viewMode === 'list' ? <ListView /> : <KanbanView />}
        </div>
      </main>
      
      <TaskModal />

      {/* Task Detail View - only rendered when isTaskDetailOpen is true */}
      {isTaskDetailOpen && taskBeingViewed && (
        <TaskDetailView 
          task={taskBeingViewed} 
          onClose={() => dispatch(closeTaskDetail())} 
        />
      )}

      <DeleteConfirmModal />
      <BulkEditModal />
    </div>
  );
}

export default App;
