import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    Typography,
    Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';

const CreateTripDialog = ({ open, onClose, onSuccess }) => {
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [formData, setFormData] = useState({
        vehicleId: '',
        driverId: '',
        departureDate: new Date().toISOString().split('T')[0],
        departureTime: '',
        fare: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchVehicles();
            fetchDrivers();
        }
    }, [open]);

    const fetchVehicles = async () => {
        try {
            const response = await api.get('/admin/vehicles');
            if (response.data.success) {
                setVehicles(response.data.vehicles);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            toast.error('Failed to fetch vehicles');
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await api.get('/admin/drivers?isAvailable=true');
            if (response.data.success) {
                setDrivers(response.data.drivers);
            }
        } catch (error) {
            console.error('Error fetching drivers:', error);
            toast.error('Failed to fetch drivers');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.vehicleId || !formData.departureDate || !formData.departureTime || !formData.fare) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const response = await api.post('/admin/trips', formData);

            if (response.data.success) {
                toast.success('Trip created successfully!');
                setFormData({
                    vehicleId: '',
                    driverId: '',
                    departureDate: new Date().toISOString().split('T')[0],
                    departureTime: '',
                    fare: ''
                });
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error creating trip:', error);
            toast.error(error.response?.data?.message || 'Failed to create trip');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Create New Trip</Typography>
            </DialogTitle>
            <Divider />
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                select
                                label="Vehicle"
                                name="vehicleId"
                                value={formData.vehicleId}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Select Vehicle</MenuItem>
                                {vehicles.map((vehicle) => (
                                    <MenuItem key={vehicle._id} value={vehicle._id}>
                                        {vehicle.type} - {vehicle.registrationNumber} ({vehicle.totalSeats} seats)
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Driver (Optional)"
                                name="driverId"
                                value={formData.driverId}
                                onChange={handleChange}
                            >
                                <MenuItem value="">No Driver Assigned</MenuItem>
                                {drivers.map((driver) => (
                                    <MenuItem key={driver._id} value={driver._id}>
                                        {driver.name} - {driver.phone}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="date"
                                label="Departure Date"
                                name="departureDate"
                                value={formData.departureDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="time"
                                label="Departure Time"
                                name="departureTime"
                                value={formData.departureTime}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Fare per Seat (₹)"
                                name="fare"
                                value={formData.fare}
                                onChange={handleChange}
                                placeholder="e.g., 300"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Trip'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CreateTripDialog;
