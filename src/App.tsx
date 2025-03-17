//src/app.tsx

import React from 'react';
import { useAppSelector } from './app/hooks';
import Header from './components/layout/Header';
import ListView from './components/views/ListView';
import KanbanView from './components/views/KanbanView';
import TaskModal from './components/modals/TaskModal';

function App() {
  const viewMode = useAppSelector(state => state.ui.viewMode);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main>
        <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {viewMode === 'list' ? <ListView /> : <KanbanView />}
        </div>
      </main>
      
      <TaskModal />
    </div>
  );
}

export default App;
