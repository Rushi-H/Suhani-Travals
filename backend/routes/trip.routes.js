import express from 'express';
import {
    getAvailableTrips,
    createTrip,
    getTripById,
    createBooking
} from '../controllers/tripController.js';

const router = express.Router();

router.get('/', getAvailableTrips);
router.get('/:id', getTripById);
router.post('/:id/bookings', createBooking);
router.post('/', createTrip);

export default router;
