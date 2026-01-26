import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Maruti Suzuki Ertiga', 'Tata Winger 12-seater', 'BharatBenz 1017']
    },
    totalSeats: {
        type: Number,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
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
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
