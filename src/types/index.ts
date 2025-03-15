//src/types/index.ts    

export type TaskStatus = 'not started' | 'in progress' | 'completed';

export type TaskPriority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: string;
    updatedAt: string;
    customFields: Record<string,string | number | boolean>;
}

export type ViewMode = 'list' | 'kanban';

export type SortField = 'title' | 'status' | 'priority' | 'createdAt'| 'updatedAt';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
    field: SortField;
    direction: SortDirection;
}

export interface FilterConfig {
    status: TaskStatus | 'all';
    priority: TaskPriority | 'all';
    searchTerm: string;
}