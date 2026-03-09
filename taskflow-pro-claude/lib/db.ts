import { MongoClient, Db, Collection } from 'mongodb';
import { User, Task } from '@/types';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://eecvibedash:Qcy7loiS42C5IPnf@cluster3.7mxgj4n.mongodb.net/taskflowpro?appName=Cluster3';
const DB_NAME = 'taskflowpro';

let client: MongoClient | null = null;
let db: Db | null = null;

// Connect to MongoDB
export async function connectDB(): Promise<Db> {
  if (db) return db;
  
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// Get collections
export async function getUsersCollection(): Promise<Collection<User>> {
  const database = await connectDB();
  return database.collection<User>('users');
}

export async function getTasksCollection(): Promise<Collection<Task>> {
  const database = await connectDB();
  return database.collection<Task>('tasks');
}

// Initialize database with indexes and admin user
export async function initializeDatabase(): Promise<void> {
  try {
    const usersCollection = await getUsersCollection();
    const tasksCollection = await getTasksCollection();
    
    // Create indexes
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ id: 1 }, { unique: true });
    await tasksCollection.createIndex({ id: 1 }, { unique: true });
    await tasksCollection.createIndex({ userId: 1 });
    
    console.log('Database indexes created');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// User operations
export async function findUserByEmail(email: string): Promise<User | null> {
  const collection = await getUsersCollection();
  return collection.findOne({ email });
}

export async function findUserById(id: string): Promise<User | null> {
  const collection = await getUsersCollection();
  return collection.findOne({ id });
}

export async function createUser(user: User): Promise<User> {
  const collection = await getUsersCollection();
  await collection.insertOne(user);
  return user;
}

// Task operations
export async function getTasksByUserId(userId: string): Promise<Task[]> {
  const collection = await getTasksCollection();
  return collection.find({ userId }).toArray();
}

export async function getTaskById(id: string, userId: string): Promise<Task | null> {
  const collection = await getTasksCollection();
  return collection.findOne({ id, userId });
}

export async function createTask(task: Task): Promise<Task> {
  const collection = await getTasksCollection();
  await collection.insertOne(task);
  return task;
}

export async function updateTask(id: string, userId: string, updates: Partial<Task>): Promise<Task | null> {
  const collection = await getTasksCollection();
  const result = await collection.findOneAndUpdate(
    { id, userId },
    { 
      $set: { 
        ...updates, 
        updatedAt: new Date().toISOString() 
      } 
    },
    { returnDocument: 'after' }
  );
  return result;
}

export async function deleteTask(id: string, userId: string): Promise<boolean> {
  const collection = await getTasksCollection();
  const result = await collection.deleteOne({ id, userId });
  return result.deletedCount > 0;
}
