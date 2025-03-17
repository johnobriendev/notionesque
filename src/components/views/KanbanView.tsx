//src/components/views/KanbanView.tsx

import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { openTaskModal } from '../../features/ui/uiSlice';
import { updateTaskPriority, deleteTask } from '../../features/tasks/tasksSlice';
import { TaskPriority, TaskStatus, Task } from '../../types';

const KanbanView: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(state => state.tasks.present.items as Task[]);
  const filterConfig = useAppSelector(state => state.ui.filterConfig);
  
  // Filter tasks based on current configuration (not by priority since that's our column layout)
  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      // Filter by status
      if (filterConfig.status !== 'all' && task.status !== filterConfig.status) {
        return false;
      }
      
      // Filter by search term
      if (filterConfig.searchTerm && !task.title.toLowerCase().includes(filterConfig.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [tasks, filterConfig]);
  
  // Group tasks by priority for Kanban columns
  const tasksByPriority = React.useMemo(() => {
    const priorityOrder: TaskPriority[] = ['none', 'low', 'medium', 'high', 'urgent'];
    const grouped = priorityOrder.reduce((acc, priority) => {
      acc[priority] = filteredTasks.filter(task => task.priority === priority);
      return acc;
    }, {} as Record<TaskPriority, typeof filteredTasks>);
    
    return grouped;
  }, [filteredTasks]);

  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside a droppable area
    if (!destination) return;
    
    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    // Get the priority from the droppable ID (column ID)
    const newPriority = destination.droppableId as TaskPriority;
    
    // Get the task ID from the draggable ID
    const taskId = result.draggableId;
    
    // Update the task priority
    dispatch(updateTaskPriority({ id: taskId, priority: newPriority }));
  };
  
  // Get priority color class
  const getPriorityColorClass = (priority: TaskPriority): string => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 border-red-500';
      case 'high': return 'bg-orange-100 border-orange-500';
      case 'medium': return 'bg-yellow-100 border-yellow-500';
      case 'low': return 'bg-green-100 border-green-500';
      default: return 'bg-gray-100 border-gray-400';
    }
  };
  
  // Get formatted priority name
  const getPriorityName = (priority: TaskPriority): string => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: TaskStatus): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle edit task
  const handleEditTask = (taskId: string) => {
    dispatch(openTaskModal(taskId));
  };
  
  // Handle delete task
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId));
    }
  };
  
  // Task card component
  const TaskCard = ({ task }: { task: Task }) => (
    <div className="bg-white rounded shadow p-3 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-900">{task.title}</h4>
      </div>
      
      {task.description && (
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.description}</p>
      )}
      
      <div className="mt-3 flex items-center justify-between">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(task.status)}`}>
          {task.status}
        </span>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditTask(task.id)}
            className="text-indigo-600 hover:text-indigo-900 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="text-red-600 hover:text-red-900 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Custom fields (if any) */}
      {Object.keys(task.customFields).length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-medium">Custom fields:</p>
          <div className="mt-1 text-xs text-gray-600">
            {Object.entries(task.customFields).map(([key, value]) => (
              <div key={key}>
                <span className="font-medium">{key}:</span> {value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="h-full flex justify-center align-center">
      {/* <h2 className="text-xl font-semibold mb-4">Kanban Board</h2> */}
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {Object.entries(tasksByPriority).map(([priority, priorityTasks]) => (
            <div 
              key={priority}
              className={`flex-shrink-0 w-72 rounded-lg border-t-4 ${getPriorityColorClass(priority as TaskPriority)}`}
            >
              <div className="bg-white rounded-b-lg shadow h-full flex flex-col">
                <div className="p-3 border-b bg-gray-50">
                  <h3 className="font-medium">
                    {getPriorityName(priority as TaskPriority)} ({priorityTasks.length})
                  </h3>
                </div>
                
                <Droppable droppableId={priority}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 overflow-y-auto min-h-[200px] ${
                        snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
                      }`}
                    >
                      {priorityTasks.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">
                          No tasks
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {priorityTasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${snapshot.isDragging ? 'opacity-70' : ''}`}
                                >
                                  <TaskCard task={task} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanView;