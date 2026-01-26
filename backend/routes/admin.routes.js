import express from 'express';
import {
    getAllBookings,
    updateBookingStatus,
    updateSeatStatus,
    updateTripStatus,
    getAllTrips,
    getDashboardStats
} from '../controllers/adminController.js';
import {
    getAllDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
    getAllVehicles
} from '../controllers/driverController.js';
import { createTrip } from '../controllers/tripController.js';
import { createVehicle, seedSampleVehicles } from '../controllers/vehicleController.js';

const router = express.Router();

// Booking management
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// Trip management
router.get('/trips', getAllTrips);
router.post('/trips', createTrip);
router.patch('/trips/:tripId/status', updateTripStatus);
router.patch('/trips/:tripId/seats', updateSeatStatus);

// Driver management
router.get('/drivers', getAllDrivers);
router.post('/drivers', createDriver);
router.put('/drivers/:id', updateDriver);
router.delete('/drivers/:id', deleteDriver);

// Vehicle management
router.get('/vehicles', getAllVehicles);
router.post('/vehicles', createVehicle);

// Dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

export default router;
