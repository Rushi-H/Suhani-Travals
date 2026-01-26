import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    user: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        }
    },
    seatNumbers: [{
        type: Number,
        required: true
    }],
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled'],
        default: 'Pending'
    },
    pickupLocation: {
        type: String,
        required: true,
        trim: true
    },
    payment: {
        amount: {
            type: Number,
            required: true
        },
        method: {
            type: String,
            enum: ['Online', 'Cash', 'UPI'],
            default: 'Online'
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
            default: 'Pending'
        },
        transactionId: {
            type: String,
            default: null
        }
    },
    documents: {
        idProof: {
            type: String,
            default: null
        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    adminNotes: {
        type: String,
        default: null
    },
    rejectionReason: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ trip: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
