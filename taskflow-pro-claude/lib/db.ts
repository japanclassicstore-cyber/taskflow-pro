import fs from 'fs';
import path from 'path';
import { Database, User, Task } from '@/types';

const DB_PATH = path.join(process.cwd(), 'db.json');

// Initialize database if it doesn't exist
function initializeDB(): Database {
  const initialData: Database = {
    users: [],
    tasks: [],
  };

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  }

  return initialData;
}

// Read database
export function readDB(): Database {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return initializeDB();
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return initializeDB();
  }
}

// Write database
export function writeDB(data: Database): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw new Error('Failed to write to database');
  }
}

// User operations
export function findUserByEmail(email: string): User | undefined {
  const db = readDB();
  return db.users.find((user) => user.email === email);
}

export function findUserById(id: string): User | undefined {
  const db = readDB();
  return db.users.find((user) => user.id === id);
}

export function createUser(user: User): User {
  const db = readDB();
  db.users.push(user);
  writeDB(db);
  return user;
}

// Task operations
export function getTasksByUserId(userId: string): Task[] {
  const db = readDB();
  return db.tasks.filter((task) => task.userId === userId);
}

export function getTaskById(id: string, userId: string): Task | undefined {
  const db = readDB();
  return db.tasks.find((task) => task.id === id && task.userId === userId);
}

export function createTask(task: Task): Task {
  const db = readDB();
  db.tasks.push(task);
  writeDB(db);
  return task;
}

export function updateTask(id: string, userId: string, updates: Partial<Task>): Task | null {
  const db = readDB();
  const taskIndex = db.tasks.findIndex((task) => task.id === id && task.userId === userId);
  
  if (taskIndex === -1) return null;
  
  db.tasks[taskIndex] = { ...db.tasks[taskIndex], ...updates, updatedAt: new Date().toISOString() };
  writeDB(db);
  return db.tasks[taskIndex];
}

export function deleteTask(id: string, userId: string): boolean {
  const db = readDB();
  const taskIndex = db.tasks.findIndex((task) => task.id === id && task.userId === userId);
  
  if (taskIndex === -1) return false;
  
  db.tasks.splice(taskIndex, 1);
  writeDB(db);
  return true;
}
