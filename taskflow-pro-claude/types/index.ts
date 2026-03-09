export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  userId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags?: string[];
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface Database {
  users: User[];
  tasks: Task[];
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}
