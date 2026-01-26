import Driver from '../models/Driver.js';
import Vehicle from '../models/Vehicle.js';

// Get all drivers
export const getAllDrivers = async (req, res) => {
    try {
        const { isAvailable } = req.query;
        let query = {};

        if (isAvailable !== undefined) {
            query.isAvailable = isAvailable === 'true';
        }

        const drivers = await Driver.find(query)
            .populate('assignedVehicle')
            .sort({ name: 1 });

        res.json({
            success: true,
            count: drivers.length,
            drivers
        });
    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching drivers',
            error: error.message
        });
    }
};

// Create new driver
export const createDriver = async (req, res) => {
    try {
        const { name, phone, email, licenseNumber, experience, assignedVehicle } = req.body;

        const driver = new Driver({
            name,
            phone,
            email,
            licenseNumber,
            experience,
            assignedVehicle: assignedVehicle || null
        });

        await driver.save();
        await driver.populate('assignedVehicle');

        res.status(201).json({
            success: true,
            message: 'Driver created successfully',
            driver
        });
    } catch (error) {
        console.error('Error creating driver:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating driver',
            error: error.message
        });
    }
};

// Update driver
export const updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const driver = await Driver.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).populate('assignedVehicle');

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Driver not found'
            });
        }

        res.json({
            success: true,
            message: 'Driver updated successfully',
            driver
        });
    } catch (error) {
        console.error('Error updating driver:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating driver',
            error: error.message
        });
    }
};

// Delete driver
export const deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;

        const driver = await Driver.findByIdAndDelete(id);

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Driver not found'
            });
        }

        res.json({
            success: true,
            message: 'Driver deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting driver:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting driver',
            error: error.message
        });
    }
};

// Get all vehicles
export const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ isActive: true }).sort({ name: 1 });

        res.json({
            success: true,
            count: vehicles.length,
            vehicles
        });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vehicles',
            error: error.message
        });
    }
};
