
export type UserRole = 'Admin' | 'Member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string;
  dueDate: string;
  createdAt: string;
  subtasks?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'On Hold' | 'Completed';
  ownerId: string;
  members: string[]; // User IDs
  createdAt: string;
}
