
export type UserRole = 'Admin' | 'Member';

export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Blocked' | 'Review';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedToId: string;
  createdBy: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  subtasks?: string[];
  projectMembers?: Record<string, string>;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'On Hold' | 'Completed' | 'Archived';
  createdBy: string;
  members: Record<string, string>; // UserID -> Role
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  dueDate?: string;
}

export interface ProjectMembership {
  id: string;
  projectId: string;
  userId: string;
  role: UserRole;
  joinedAt: string;
  projectMembers?: Record<string, string>;
}
