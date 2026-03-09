import { connectDB, initializeDatabase, createUser, findUserByEmail } from './lib/db';
import { hashPassword } from './lib/auth';
import { generateId } from './lib/utils';
import { User } from './types';

async function seedAdminUser() {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Check if admin user already exists
    const existingAdmin = await findUserByEmail('admin@taskflowpro.com');
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('   Email: admin@taskflowpro.com');
      console.log('   Password: admin123');
      process.exit(0);
    }
    
    // Create admin user
    const hashedPassword = await hashPassword('admin123');
    
    const adminUser: User = {
      id: generateId(),
      email: 'admin@taskflowpro.com',
      name: 'Admin User',
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    
    await createUser(adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📧 Login Credentials:');
    console.log('   Email: admin@taskflowpro.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('🔗 App URL: https://taskflow-pro-claude.vercel.app');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdminUser();
