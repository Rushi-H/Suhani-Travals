let io;

export const initializeSocket = (socketIO) => {
    io = socketIO;

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join-admin', () => {
            socket.join('admin-room');
            console.log('Admin joined:', socket.id);
        });

        socket.on('join-customer', () => {
            socket.join('customer-room');
            console.log('Customer joined:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

export const emitSeatUpdate = (tripId, seatData) => {
    if (io) {
        io.emit('seat-updated', {
            tripId,
            seatData,
            timestamp: new Date()
        });
        console.log('Seat update emitted for trip:', tripId);
    }
};

export const emitBookingUpdate = (booking) => {
    if (io) {
        io.to('admin-room').emit('booking-updated', {
            booking,
            timestamp: new Date()
        });
        console.log('Booking update emitted:', booking._id);
    }
};

export const emitNewBooking = (booking) => {
    if (io) {
        io.to('admin-room').emit('new-booking', {
            booking,
            timestamp: new Date()
        });
        console.log('New booking notification sent to admin');
    }
};

export const emitTripStatusUpdate = (tripId, status) => {
    if (io) {
        io.emit('trip-status-updated', {
            tripId,
            status,
            timestamp: new Date()
        });
        console.log('Trip status update emitted:', tripId, status);
    }
};

export const emitTripUpdate = (trip) => {
    if (io) {
        io.emit('trip-updated', {
            trip,
            timestamp: new Date()
        });
        console.log('Trip update emitted:', trip._id);
    }
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};
