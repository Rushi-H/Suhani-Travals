import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
    seatNumber: {
        type: Number,
        required: true
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    bookedBy: {
        type: String,
        default: null
    },
    bookingType: {
        type: String,
        enum: ['Online', 'Manual', null],
        default: null
    },
    bookingRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null
    }
}, { _id: false });

const tripSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        default: null
    },
    departureDate: {
        type: Date,
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    route: {
        from: {
            type: String,
            default: 'Akluj'
        },
        to: {
            type: String,
            default: 'Pune'
        }
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Boarding', 'Full', 'Departed', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    seats: [seatSchema],
    fare: {
        type: Number,
        required: true
    },
    totalRevenue: {
        type: Number,
        default: 0
    },
    bookedSeatsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

tripSchema.methods.initializeSeats = function (totalSeats) {
    this.seats = [];
    for (let i = 1; i <= totalSeats; i++) {
        this.seats.push({
            seatNumber: i,
            isBooked: false,
            bookedBy: null,
            bookingType: null,
            bookingRef: null
        });
    }
};

tripSchema.methods.updateBookedSeatsCount = function () {
    this.bookedSeatsCount = this.seats.filter(seat => seat.isBooked).length;
    const totalSeats = this.seats.length;
    if (this.bookedSeatsCount === totalSeats && this.status === 'Scheduled') {
        this.status = 'Full';
    }
};

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
