const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://eecvibedash:Qcy7loiS42C5IPnf@cluster3.7mxgj4n.mongodb.net/taskflowpro?appName=Cluster3';
const DB_NAME = 'taskflowpro';

function generateId() {
  return crypto.randomUUID();
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function seedAdminUser() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');
    
    // Create indexes
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ id: 1 }, { unique: true });
    console.log('Indexes created');
    
    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@taskflowpro.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('   Email: admin@taskflowpro.com');
      console.log('   Password: admin123');
      return;
    }
    
    // Create admin user
    const hashedPassword = await hashPassword('admin123');
    
    const adminUser = {
      id: generateId(),
      email: 'admin@taskflowpro.com',
      name: 'Admin User',
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    
    await usersCollection.insertOne(adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📧 Login Credentials:');
    console.log('   Email: admin@taskflowpro.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('🔗 App URL: https://taskflow-pro-claude.vercel.app');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

seedAdminUser();
