import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import adminRoutes from './routes/admin.routes.js';
import tripRoutes from './routes/trip.routes.js';
import authRoutes from './routes/auth.routes.js'; // Added
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { initializeSocket } from './services/socketService.js';
import { adminAuth } from './middleware/auth.js'; // Changed from generateAdminToken to adminAuth

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true
    }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Socket.io
initializeSocket(io);

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Cab Booking Admin API',
        version: '1.0.0',
        status: 'active'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// Public seed endpoint (no auth required)
app.post('/api/admin/vehicles/seed', async (req, res) => {
    try {
        const { seedSampleVehicles } = await import('./controllers/vehicleController.js');
        await seedSampleVehicles(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Protected admin routes
app.use('/api/admin', adminAuth, adminRoutes);

// Generate admin token for development (remove in production)
app.get('/api/admin/generate-token', (req, res) => {
    const token = generateAdminToken();
    res.json({
        success: true,
        token,
        message: 'Admin token generated. Use this in Authorization header as: Bearer <token>'
    });
});

app.use('/api/admin', adminRoutes);
app.use('/api/trips', tripRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');

        // Start server
        httpServer.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 Socket.io initialized`);
            console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    httpServer.close(() => process.exit(1));
});
