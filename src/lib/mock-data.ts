
import { User, Project, Task } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Rivera',
    email: 'alex@worklink.com',
    role: 'Admin',
    avatarUrl: 'https://picsum.photos/seed/user1/100/100'
  },
  {
    id: 'u2',
    name: 'Sarah Chen',
    email: 'sarah@worklink.com',
    role: 'Member',
    avatarUrl: 'https://picsum.photos/seed/user2/100/100'
  },
  {
    id: 'u3',
    name: 'James Wilson',
    email: 'james@worklink.com',
    role: 'Member',
    avatarUrl: 'https://picsum.photos/seed/user3/100/100'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Modernizing our core landing pages with a new design system.',
    status: 'Active',
    ownerId: 'u1',
    members: ['u1', 'u2', 'u3'],
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'p2',
    name: 'Marketing Q2 Strategy',
    description: 'Planning campaigns and content strategy for second quarter.',
    status: 'On Hold',
    ownerId: 'u1',
    members: ['u1', 'u2'],
    createdAt: '2024-02-01T09:00:00Z'
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Design Hero Section',
    description: 'Create high-fidelity mockups for the landing page hero section.',
    status: 'In Progress',
    assigneeId: 'u2',
    dueDate: '2024-03-25',
    createdAt: '2024-03-10T14:00:00Z'
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'Accessibility Audit',
    description: 'Review color contrast and keyboard navigation.',
    status: 'To Do',
    assigneeId: 'u3',
    dueDate: '2024-03-30',
    createdAt: '2024-03-11T11:00:00Z'
  },
  {
    id: 't3',
    projectId: 'p1',
    title: 'Develop Mobile Menu',
    description: 'Implement the responsive side menu navigation.',
    status: 'Done',
    assigneeId: 'u1',
    dueDate: '2024-03-15',
    createdAt: '2024-03-05T16:00:00Z'
  }
];
