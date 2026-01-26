import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './models/Vehicle.js';
import Trip from './models/Trip.js';
import Booking from './models/Booking.js';

dotenv.config();

// Sample data
const vehicles = [
    {
        name: 'Swift Dzire-01',
        type: 'Maruti Suzuki Ertiga',
        totalSeats: 7,
        registrationNumber: 'MH-12-AB-1234',
        route: { from: 'Akluj', to: 'Pune' }
    },
    {
        name: 'Winger-01',
        type: 'Tata Winger 12-seater',
        totalSeats: 12,
        registrationNumber: 'MH-12-CD-5678',
        route: { from: 'Akluj', to: 'Pune' }
    },
    {
        name: 'BharatBenz-01',
        type: 'BharatBenz 1017',
        totalSeats: 20,
        registrationNumber: 'MH-12-EF-9012',
        route: { from: 'Akluj', to: 'Pune' }
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');

        // Clear existing data
        await Vehicle.deleteMany({});
        await Trip.deleteMany({});
        await Booking.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Insert vehicles
        const createdVehicles = await Vehicle.insertMany(vehicles);
        console.log('✅ Vehicles created:', createdVehicles.length);

        // Create sample trips for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const trips = [];
        const departureTimes = ['06:00 AM', '10:00 AM', '02:00 PM', '06:00 PM'];

        for (const vehicle of createdVehicles) {
            for (const time of departureTimes) {
                const trip = new Trip({
                    vehicle: vehicle._id,
                    departureDate: today,
                    departureTime: time,
                    fare: vehicle.type === 'Maruti Suzuki Ertiga' ? 300 :
                        vehicle.type === 'Tata Winger 12-seater' ? 250 : 200,
                    route: { from: 'Akluj', to: 'Pune' },
                    status: 'Scheduled'
                });

                trip.initializeSeats(vehicle.totalSeats);
                trips.push(trip);
            }
        }

        await Trip.insertMany(trips);
        console.log('✅ Sample trips created:', trips.length);

        console.log('🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
