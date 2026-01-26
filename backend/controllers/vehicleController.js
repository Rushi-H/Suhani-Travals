import Vehicle from '../models/Vehicle.js';

// Create a new vehicle
export const createVehicle = async (req, res) => {
    try {
        const { name, type, totalSeats, registrationNumber } = req.body;

        const vehicle = new Vehicle({
            name,
            type,
            totalSeats,
            registrationNumber,
            route: { from: 'Akluj', to: 'Pune' }
        });

        await vehicle.save();

        res.status(201).json({
            success: true,
            message: 'Vehicle created successfully',
            vehicle
        });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating vehicle',
            error: error.message
        });
    }
};

// Seed sample vehicles (for testing)
export const seedSampleVehicles = async (req, res) => {
    try {
        // Check if vehicles already exist
        const existingCount = await Vehicle.countDocuments();
        if (existingCount > 0) {
            return res.json({
                success: true,
                message: `Database already has ${existingCount} vehicles`,
                vehicles: await Vehicle.find()
            });
        }

        const sampleVehicles = [
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

        const vehicles = await Vehicle.insertMany(sampleVehicles);

        res.status(201).json({
            success: true,
            message: `Created ${vehicles.length} sample vehicles`,
            vehicles
        });
    } catch (error) {
        console.error('Error seeding vehicles:', error);
        res.status(500).json({
            success: false,
            message: 'Error seeding vehicles',
            error: error.message
        });
    }
};
