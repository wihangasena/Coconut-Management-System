import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const updatePasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB connected');

    // Password mapping for each user
    const users = [
      { username: 'admin', password: 'Admin@123' },
      { username: 'manager', password: 'Manager@123' },
      { username: 'production', password: 'Prod@123' },
      { username: 'qc', password: 'QC@123' },
      { username: 'sales', password: 'Sales@123' },
      { username: 'delivery', password: 'Delivery@123' }
    ];

    // Update each user with properly hashed password
    for (const userData of users) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(userData.password, salt);

      await User.updateOne(
        { username: userData.username },
        { password: hashedPassword }
      );

      console.log(`✓ Updated password for ${userData.username}`);
    }

    console.log('\n✓ All passwords updated successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error updating passwords:', error);
    process.exit(1);
  }
};

updatePasswords();
