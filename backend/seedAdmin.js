import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            process.exit(0);
        }

        // Create default admin
        const admin = new Admin({
            username: 'admin',
            email: 'admin@cabbook.com',
            password: 'admin123', // Will be hashed automatically
            role: 'super_admin'
        });

        await admin.save();
        console.log('✅ Default admin created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
