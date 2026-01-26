import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Typography,
    Divider,
    MenuItem
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';

const ManageDriverDialog = ({ open, onClose, driver, onSuccess }) => {
    const [vehicles, setVehicles] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        licenseNumber: '',
        experience: '',
        assignedVehicle: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchVehicles();
            if (driver) {
                setFormData({
                    name: driver.name || '',
                    phone: driver.phone || '',
                    email: driver.email || '',
                    licenseNumber: driver.licenseNumber || '',
                    experience: driver.experience || '',
                    assignedVehicle: driver.assignedVehicle?._id || ''
                });
            } else {
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    licenseNumber: '',
                    experience: '',
                    assignedVehicle: ''
                });
            }
        }
    }, [open, driver]);

    const fetchVehicles = async () => {
        try {
            const response = await api.get('/admin/vehicles');
            if (response.data.success) {
                setVehicles(response.data.vehicles);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
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

        if (!formData.name || !formData.phone || !formData.licenseNumber) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);

            // Prepare data - convert empty string to null for assignedVehicle
            const dataToSend = {
                ...formData,
                assignedVehicle: formData.assignedVehicle || null
            };

            let response;

            if (driver) {
                response = await api.put(`/admin/drivers/${driver._id}`, dataToSend);
            } else {
                response = await api.post('/admin/drivers', dataToSend);
            }

            if (response.data.success) {
                toast.success(driver ? 'Driver updated successfully!' : 'Driver created successfully!');
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error saving driver:', error);
            toast.error(error.response?.data?.message || 'Failed to save driver');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6">{driver ? 'Edit Driver' : 'Add New Driver'}</Typography>
            </DialogTitle>
            <Divider />
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Driver Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter driver name"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="9876543210"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="driver@example.com"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="License Number"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                placeholder="MH1234567890"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Experience (years)"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="5"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Assigned Vehicle"
                                name="assignedVehicle"
                                value={formData.assignedVehicle}
                                onChange={handleChange}
                            >
                                <MenuItem value="">No Vehicle Assigned</MenuItem>
                                {vehicles.map((vehicle) => (
                                    <MenuItem key={vehicle._id} value={vehicle._id}>
                                        {vehicle.type} - {vehicle.registrationNumber}
                                    </MenuItem>
                                ))}
                            </TextField>
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
                        {loading ? 'Saving...' : driver ? 'Update Driver' : 'Add Driver'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ManageDriverDialog;
