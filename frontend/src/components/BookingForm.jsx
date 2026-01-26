import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Typography,
    Box,
    MenuItem,
    Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';

const BookingForm = ({ open, onClose, trip, selectedSeats, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        pickupLocation: '',
        paymentMethod: 'Online'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.pickupLocation) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        try {
            setLoading(true);
            const totalAmount = selectedSeats.length * trip.fare;

            const bookingData = {
                tripId: trip._id,
                user: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                },
                seatNumbers: selectedSeats,
                pickupLocation: formData.pickupLocation,
                payment: {
                    method: formData.paymentMethod,
                    status: 'Completed',
                    transactionId: `TXN${Date.now()}`
                }
            };

            const response = await api.post(`/trips/${trip._id}/bookings`, bookingData);

            if (response.data.success) {
                toast.success('Booking submitted successfully! Awaiting admin approval.');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    pickupLocation: '',
                    paymentMethod: 'Online'
                });
                onSuccess();
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            toast.error(error.response?.data?.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = selectedSeats.length * (trip?.fare || 0);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Complete Your Booking</Typography>
                <Typography variant="caption" color="text.secondary">
                    {trip?.vehicle?.type} - {trip?.departureTime}
                </Typography>
            </DialogTitle>
            <Divider />
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            <strong>Selected Seats:</strong> {selectedSeats.join(', ')}
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                            Total Amount: ₹{totalAmount}
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="email"
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
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

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Pickup Location"
                                name="pickupLocation"
                                value={formData.pickupLocation}
                                onChange={handleChange}
                                placeholder="e.g., Akluj Bus Stand, Near Railway Station"
                                helperText="Specify your preferred pickup point in Akluj"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Payment Method"
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                            >
                                <MenuItem value="Online">Online Payment</MenuItem>
                                <MenuItem value="UPI">UPI</MenuItem>
                                <MenuItem value="Cash">Cash on Boarding</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                        <Typography variant="body2" color="warning.dark">
                            ⚠️ <strong>Note:</strong> Your booking will be confirmed after admin verification. You'll receive email and WhatsApp notifications once approved.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : `Confirm Booking (₹${totalAmount})`}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default BookingForm;
