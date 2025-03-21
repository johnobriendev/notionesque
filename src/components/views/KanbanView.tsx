// //src/components/views/KanbanView.tsx

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { openTaskModal, openTaskDetail, openDeleteConfirm } from '../../features/ui/uiSlice';
import { updateTaskPriority, deleteTask, reorderTasks, addTask } from '../../features/tasks/tasksSlice';
import { TaskPriority, TaskStatus, Task } from '../../types';

const KanbanView: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(state => state.tasks.present.items as Task[]);
  const filterConfig = useAppSelector(state => state.ui.filterConfig);
  
  // State for quick add task inputs in each column
  const [newTaskInputs, setNewTaskInputs] = useState<Record<TaskPriority, string>>({
    none: '',
    low: '',
    medium: '',
    high: '',
    urgent: ''
  });
  
  // State to track which column has an active input
  const [activeInputColumn, setActiveInputColumn] = useState<TaskPriority | null>(null);
  
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
      // Get all tasks for this priority and sort by position
      const priorityTasks = filteredTasks
        .filter(task => task.priority === priority)
        .sort((a, b) => {
          // If position is undefined, use a fallback sort by createdAt
          if (a.position === undefined && b.position === undefined) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          // Handle cases where only one task has position
          if (a.position === undefined) return 1;
          if (b.position === undefined) return -1;
          // Normal sort by position
          return a.position - b.position;
        });
      
      acc[priority] = priorityTasks;
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
    const sourcePriority = source.droppableId as TaskPriority;
    const destinationPriority = destination.droppableId as TaskPriority;
    
    // Get the task ID from the draggable ID
    const taskId = result.draggableId;
    
    // If moving between columns, update priority with destination index
    if (sourcePriority !== destinationPriority) {
      dispatch(updateTaskPriority({ 
        id: taskId, 
        priority: destinationPriority,
        destinationIndex: destination.index
      }));
    } 
    // If reordering within the same column
    else {
      const columnTasks = tasksByPriority[sourcePriority];
      const reorderedTasks = Array.from(columnTasks);
      
      // Remove the task from its old position
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      
      // Insert the task at its new position
      reorderedTasks.splice(destination.index, 0, movedTask);
      
      // Create an array of task IDs in their new order
      const newOrder = reorderedTasks.map(task => task.id);
      
      // Dispatch an action to update the task order
      dispatch(reorderTasks({ 
        priority: sourcePriority, 
        taskIds: newOrder
      }));
    }
  };
  
  // Handle showing the task input for a specific column
  const handleShowInput = (priority: TaskPriority) => {
    setActiveInputColumn(priority);
  };
  
  // Handle input change
  const handleInputChange = (priority: TaskPriority, value: string) => {
    setNewTaskInputs(prev => ({
      ...prev,
      [priority]: value
    }));
  };
  
  // Handle creating a new task
  const handleCreateTask = (priority: TaskPriority) => {
    const title = newTaskInputs[priority].trim();
    if (title) {
      // Create a new task with the specified priority and default status
      dispatch(addTask({
        title,
        description: '',
        status: 'not started',
        priority,
        customFields: {}
      }));
      
      // Reset the input
      setNewTaskInputs(prev => ({
        ...prev,
        [priority]: ''
      }));
      setActiveInputColumn(null);
    }
  };
  
  // Handle canceling task creation
  const handleCancelTask = () => {
    setActiveInputColumn(null);
  };
  
  // Handle key press events (Enter to submit, Escape to cancel)
  const handleKeyDown = (e: React.KeyboardEvent, priority: TaskPriority) => {
    if (e.key === 'Enter') {
      handleCreateTask(priority);
    } else if (e.key === 'Escape') {
      handleCancelTask();
    }
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
    dispatch(openDeleteConfirm(taskId));
  };
  
  // Task card component
  const TaskCard = ({ task }: { task: Task }) => (
    <div className="bg-white rounded shadow p-3 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h4 
        className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
        onClick={() => dispatch(openTaskDetail(task.id))}
        >
          {task.title}
        </h4>
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
                      
                      {/* Quick Add Task Input */}
                      {activeInputColumn === priority as TaskPriority ? (
                        <div className="mt-2 p-2 bg-white rounded shadow border border-gray-200">
                          <textarea
                            value={newTaskInputs[priority as TaskPriority]}
                            onChange={(e) => handleInputChange(priority as TaskPriority, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, priority as TaskPriority)}
                            placeholder="Enter task title"
                            className="w-full p-2 border border-gray-300 rounded mb-2 resize-y min-h-[60px]"
                            autoFocus
                          />
                          <div className="flex justify-between">
                            <button
                              onClick={() => handleCreateTask(priority as TaskPriority)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                              Add
                            </button>
                            <button
                              onClick={handleCancelTask}
                              className="px-3 py-1 text-gray-600 rounded text-sm hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleShowInput(priority as TaskPriority)}
                          className="mt-2 w-full p-2 text-blue-600 hover:bg-blue-50 rounded text-sm flex items-center justify-center"
                        >
                          <span className="text-lg mr-1">+</span> Add task
                        </button>
                      )}
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