import Trip from '../models/Trip.js';
import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import { emitNewBooking, emitSeatUpdate } from '../services/socketService.js';

export const getAvailableTrips = async (req, res) => {
    try {
        const { date, from, to } = req.query;
        let query = { status: { $in: ['Scheduled', 'Boarding'] } };
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.departureDate = { $gte: startOfDay, $lte: endOfDay };
        }
        if (from) query['route.from'] = from;
        if (to) query['route.to'] = to;
        const trips = await Trip.find(query).populate('vehicle').sort({ departureDate: 1, departureTime: 1 });
        const availableTrips = trips.filter(trip => {
            const availableSeats = trip.seats.filter(seat => !seat.isBooked).length;
            return availableSeats > 0;
        });
        res.json({ success: true, count: availableTrips.length, trips: availableTrips });
    } catch (error) {
        console.error('Error fetching available trips:', error);
        res.status(500).json({ success: false, message: 'Error fetching available trips', error: error.message });
    }
};

export const createTrip = async (req, res) => {
    try {
        const { vehicleId, driverId, departureDate, departureTime, fare } = req.body;
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        const trip = new Trip({
            vehicle: vehicleId,
            driver: driverId || null,
            departureDate,
            departureTime,
            fare,
            route: vehicle.route
        });
        trip.initializeSeats(vehicle.totalSeats);
        await trip.save();
        await trip.populate(['vehicle', 'driver']);
        res.status(201).json({ success: true, message: 'Trip created successfully', trip });
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ success: false, message: 'Error creating trip', error: error.message });
    }
};

export const getTripById = async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await Trip.findById(id).populate('vehicle');
        if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
        res.json({ success: true, trip });
    } catch (error) {
        console.error('Error fetching trip:', error);
        res.status(500).json({ success: false, message: 'Error fetching trip', error: error.message });
    }
};

export const createBooking = async (req, res) => {
    try {
        const { tripId, user, seatNumbers, pickupLocation, payment } = req.body;
        const trip = await Trip.findById(tripId).populate('vehicle');
        if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
        if (!['Scheduled', 'Boarding'].includes(trip.status)) {
            return res.status(400).json({ success: false, message: 'This trip is no longer accepting bookings' });
        }
        for (const seatNum of seatNumbers) {
            const seat = trip.seats.find(s => s.seatNumber === seatNum);
            if (!seat || seat.isBooked) {
                return res.status(400).json({ success: false, message: `Seat ${seatNum} is not available` });
            }
        }
        const booking = new Booking({
            trip: tripId,
            user,
            seatNumbers,
            pickupLocation,
            payment: { amount: trip.fare * seatNumbers.length, ...payment }
        });
        await booking.save();
        await booking.populate({ path: 'trip', populate: { path: 'vehicle' } });
        emitNewBooking(booking);
        res.status(201).json({ success: true, message: 'Booking created successfully. Awaiting admin approval.', booking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, message: 'Error creating booking', error: error.message });
    }
};
