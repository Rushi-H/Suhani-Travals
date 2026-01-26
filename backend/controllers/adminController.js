import Booking from '../models/Booking.js';
import Trip from '../models/Trip.js';
import Vehicle from '../models/Vehicle.js';
import {
    sendBookingConfirmationEmail,
    sendBookingRejectionEmail,
    sendBookingConfirmationWhatsApp,
    sendBookingRejectionWhatsApp
} from '../services/notificationService.js';
import {
    emitBookingUpdate,
    emitSeatUpdate,
    emitTripStatusUpdate,
    emitTripUpdate
} from '../services/socketService.js';

export const getAllBookings = async (req, res) => {
    try {
        const { status, tripId, startDate, endDate } = req.query;
        let query = {};
        if (status) query.status = status;
        if (tripId) query.trip = tripId;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }
        const bookings = await Booking.find(query)
            .populate({ path: 'trip', populate: { path: 'vehicle' } })
            .sort({ createdAt: -1 });
        res.json({ success: true, count: bookings.length, bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason, adminNotes } = req.body;
        if (!['Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status. Must be "Accepted" or "Rejected"' });
        }
        const booking = await Booking.findById(id).populate({ path: 'trip', populate: { path: 'vehicle' } });
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        if (booking.status !== 'Pending') {
            return res.status(400).json({ success: false, message: `Booking is already ${booking.status}` });
        }
        booking.status = status;
        if (rejectionReason) booking.rejectionReason = rejectionReason;
        if (adminNotes) booking.adminNotes = adminNotes;
        if (status === 'Accepted') {
            const trip = booking.trip;
            booking.seatNumbers.forEach(seatNum => {
                const seat = trip.seats.find(s => s.seatNumber === seatNum);
                if (seat) {
                    seat.isBooked = true;
                    seat.bookedBy = booking.user.email;
                    seat.bookingType = 'Online';
                    seat.bookingRef = booking._id;
                }
            });
            trip.totalRevenue += booking.payment.amount;
            trip.updateBookedSeatsCount();
            await trip.save();
            await Promise.all([
                sendBookingConfirmationEmail(booking, trip),
                sendBookingConfirmationWhatsApp(booking, trip)
            ]);
            emitSeatUpdate(trip._id, trip.seats);
            emitTripUpdate(trip);
        } else if (status === 'Rejected') {
            await Promise.all([
                sendBookingRejectionEmail(booking, rejectionReason),
                sendBookingRejectionWhatsApp(booking, rejectionReason)
            ]);
        }
        await booking.save();
        emitBookingUpdate(booking);
        res.json({ success: true, message: `Booking ${status.toLowerCase()} successfully`, booking });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ success: false, message: 'Error updating booking status', error: error.message });
    }
};

export const updateSeatStatus = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { seatNumber, isBooked, bookedBy } = req.body;
        const trip = await Trip.findById(tripId).populate('vehicle');
        if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
        const seat = trip.seats.find(s => s.seatNumber === seatNumber);
        if (!seat) return res.status(404).json({ success: false, message: 'Seat not found' });
        seat.isBooked = isBooked;
        seat.bookedBy = isBooked ? (bookedBy || 'Offline-Admin') : null;
        seat.bookingType = isBooked ? 'Manual' : null;
        seat.bookingRef = null;
        trip.updateBookedSeatsCount();
        await trip.save();
        emitSeatUpdate(trip._id, trip.seats);
        emitTripUpdate(trip);
        res.json({ success: true, message: 'Seat status updated successfully', seat, trip });
    } catch (error) {
        console.error('Error updating seat status:', error);
        res.status(500).json({ success: false, message: 'Error updating seat status', error: error.message });
    }
};

export const updateTripStatus = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { status } = req.body;
        const validStatuses = ['Scheduled', 'Boarding', 'Full', 'Departed', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }
        const trip = await Trip.findById(tripId).populate('vehicle');
        if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
        trip.status = status;
        await trip.save();
        emitTripStatusUpdate(trip._id, status);
        emitTripUpdate(trip);
        res.json({ success: true, message: 'Trip status updated successfully', trip });
    } catch (error) {
        console.error('Error updating trip status:', error);
        res.status(500).json({ success: false, message: 'Error updating trip status', error: error.message });
    }
};

export const getAllTrips = async (req, res) => {
    try {
        const { status, date } = req.query;
        let query = {};
        if (status) query.status = status;
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.departureDate = { $gte: startOfDay, $lte: endOfDay };
        }
        const trips = await Trip.find(query).populate('vehicle').sort({ departureDate: 1, departureTime: 1 });
        res.json({ success: true, count: trips.length, trips });
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ success: false, message: 'Error fetching trips', error: error.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayTrips = await Trip.find({ departureDate: { $gte: today, $lt: tomorrow } }).populate('vehicle');
        const totalRevenue = todayTrips.reduce((sum, trip) => sum + trip.totalRevenue, 0);
        const pendingBookingsCount = await Booking.countDocuments({ status: 'Pending' });
        const todayBookings = await Booking.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } });
        const totalSeats = todayTrips.reduce((sum, trip) => sum + trip.seats.length, 0);
        const bookedSeats = todayTrips.reduce((sum, trip) => sum + trip.bookedSeatsCount, 0);
        const occupancyRate = totalSeats > 0 ? ((bookedSeats / totalSeats) * 100).toFixed(2) : 0;
        const revenueByVehicle = todayTrips.reduce((acc, trip) => {
            const vehicleName = trip.vehicle.type;
            if (!acc[vehicleName]) acc[vehicleName] = 0;
            acc[vehicleName] += trip.totalRevenue;
            return acc;
        }, {});
        res.json({
            success: true,
            stats: {
                totalRevenue,
                pendingBookingsCount,
                todayBookings,
                occupancyRate: parseFloat(occupancyRate),
                totalTrips: todayTrips.length,
                revenueByVehicle,
                tripsByStatus: {
                    scheduled: todayTrips.filter(t => t.status === 'Scheduled').length,
                    boarding: todayTrips.filter(t => t.status === 'Boarding').length,
                    full: todayTrips.filter(t => t.status === 'Full').length,
                    departed: todayTrips.filter(t => t.status === 'Departed').length,
                    completed: todayTrips.filter(t => t.status === 'Completed').length
                }
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Error fetching dashboard statistics', error: error.message });
    }
};
