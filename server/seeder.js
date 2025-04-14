import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import colors from 'colors'; // Optional for colored console output

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'.cyan.underline))
  .catch(err => {
    console.error(`Error connecting to database: ${err.message}`.red.bold);
    process.exit(1);
  });

const createAdmin = async () => {
  try {
    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('Admin already exists'.yellow.bold);
      console.log(`Email: ${adminExists.email}`.green);
      process.exit(0);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
    
    // Create admin user
    const admin = await User.create({
      Firstname: process.env.ADMIN_FIRSTNAME || 'Admin',
      Lastname: process.env.ADMIN_LASTNAME || 'User',
      sexe: process.env.ADMIN_GENDER || 'Male',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      phone_number: process.env.ADMIN_PHONE,
      address: process.env.ADMIN_ADDRESS || 'Admin Address',
      role: 'admin'
    });
    
    console.log('Admin created successfully:'.green.bold);
    console.log(`Name: ${admin.Firstname} ${admin.Lastname}`.green);
    console.log(`Email: ${admin.email}`.green);
    console.log(`Role: ${admin.role}`.green);
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Function to destroy all data (optional - use with caution)
const destroyData = async () => {
  try {
    await User.deleteMany({ role: 'admin' });
    console.log('Admin users destroyed'.red.inverse);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Command line argument handling
if (process.argv[2] === '-d') {
  destroyData();
} else {
  createAdmin();
}