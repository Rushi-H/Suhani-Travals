import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    experience: {
        type: Number, // years of experience
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    assignedVehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        default: null
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 5
    },
    totalTrips: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
