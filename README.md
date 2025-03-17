# Notionesque

A powerful task management application built with React, Redux, TypeScript, and Tailwind CSS. This application provides a comprehensive set of features for managing tasks with advanced capabilities similar to a simplified Notion database.

## Features

### Multiple View Modes

* **List View**: Table format with sorting and pagination
* **Kanban View**: Drag-and-drop interface organized by priority

### Rich Task Management

* Create, edit, and delete tasks
* Set title, description, status, and priority
* Add custom fields for extended information
* View detailed task information

### Advanced Filtering & Sorting

* Filter by status and priority
* Search by task name
* Sort by any column in list view

### User-Friendly Interface

* Drag and drop tasks between priority columns
* Bulk selection and actions
* Responsive design for all screen sizes

### Data Persistence

* Automatic local storage saving
* Undo/redo functionality for all actions

## Tech Stack

* **React**: UI library for building the interface
* **TypeScript**: Static typing for better development experience
* **Redux Toolkit**: State management with advanced features
* **Redux-Undo**: Undo/redo capabilities
* **Redux-Persist**: Local storage persistence
* **@hello-pangea/dnd**: Drag-and-drop functionality
* **Tailwind CSS**: Utility-first CSS framework

## Getting Started

### Prerequisites

* Node.js (v14 or newer)
* npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/johnobriendev/notionesque.git
cd notionesque
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser to http://localhost:5173

## Usage Guide

### Creating Tasks

1. Click the "Create Task" button in the header
2. Fill in the task details:
   * Title (required)
   * Description (optional)
   * Status (Not Started, In Progress, Completed)
   * Priority (None, Low, Medium, High, Urgent)
   * Custom Fields (optional)
3. Click "Create" to add the task

### Managing Tasks

<!-- * **View Task Details**: Click on a task's title to view all details -->
* **Edit a Task**: Click the "Edit" button on a task card or in the detail view
* **Delete a Task**: Click the "Delete" button on a task card or in the detail view
* **Bulk Actions**: Select multiple tasks in list view to perform actions on them

### Using Views

* Toggle between List and Kanban views using the buttons in the header
* **List View**: Sort by clicking column headers, paginate with controls at the bottom
* **Kanban View**: Drag tasks between priority columns to change their priority

### Filtering and Searching

* Use the search box to find tasks by title
* Use the Status and Priority dropdowns to filter tasks
* Filters work in both List and Kanban views

### Undo/Redo

* Use the undo and redo buttons in the header to revert or restore changes
* All actions (create, edit, delete, priority changes) can be undone

## Project Structure

```
src/
├── app/                    # Redux store setup and app hooks
├── components/             # UI components
│   ├── common/             # Reusable components
│   ├── layout/             # Layout components (Header)
│   ├── modals/             # Modal components (TaskModal)
│   ├── task/               # Task-related components (TaskDetailView)
│   └── views/              # Main views (ListView, KanbanView)
├── features/               # Redux Toolkit feature slices
│   ├── tasks/              # Tasks slice (CRUD operations)
│   └── ui/                 # UI state slice (view mode, filters, etc.)
├── types/                  # TypeScript type definitions
├── App.tsx                 # Main App component
└── main.tsx                # Entry point
```

## Customization

### Adding New Task Statuses

1. Update the TaskStatus type in src/types/index.ts
2. Add the new status to the dropdown in TaskModal.tsx
3. Add styling for the new status in the list and kanban views

### Adding New Priority Levels

1. Update the TaskPriority type in src/types/index.ts
2. Add the new priority to the dropdown in TaskModal.tsx
3. Add a new column in the KanbanView.tsx for the new priority level
4. Add styling for the new priority in both views

## License

This project is licensed under the MIT License - see the LICENSE file for details.

