import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, Tooltip, Button } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';

const SeatMap = ({ trip, onSeatUpdate }) => {
    const [loading, setLoading] = useState(false);

    const handleSeatClick = async (seat) => {
        if (loading) return;

        try {
            setLoading(true);
            const newStatus = !seat.isBooked;

            const response = await api.patch(`/admin/trips/${trip._id}/seats`, {
                seatNumber: seat.seatNumber,
                isBooked: newStatus,
                bookedBy: newStatus ? 'Offline-Admin' : null
            });

            if (response.data.success) {
                toast.success(
                    newStatus
                        ? `Seat ${seat.seatNumber} marked as Full (Manual Booking)`
                        : `Seat ${seat.seatNumber} marked as Vacant`
                );
                onSeatUpdate();
            }
        } catch (error) {
            console.error('Error updating seat:', error);
            toast.error(error.response?.data?.message || 'Failed to update seat status');
        } finally {
            setLoading(false);
        }
    };

    const getSeatColor = (seat) => {
        if (!seat.isBooked) return '#10b981'; // Green - Vacant
        if (seat.bookingType === 'Manual') return '#ef4444'; // Red - Manual/Full
        return '#3b82f6'; // Blue - Online Booking
    };

    const getSeatLabel = (seat) => {
        if (!seat.isBooked) return 'Vacant';
        if (seat.bookingType === 'Manual') return 'Manual';
        return 'Booked';
    };

    const getGridColumns = () => {
        const totalSeats = trip.seats.length;
        if (totalSeats <= 7) return 3; // Ertiga: 3 columns
        if (totalSeats <= 12) return 4; // Winger: 4 columns
        return 5; // BharatBenz: 5 columns
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#10b981', borderRadius: 1 }} />
                    <Typography variant="caption">Vacant</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#3b82f6', borderRadius: 1 }} />
                    <Typography variant="caption">Online Booking</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#ef4444', borderRadius: 1 }} />
                    <Typography variant="caption">Manual Booking</Typography>
                </Box>
            </Box>

            <Grid container spacing={1.5}>
                {trip.seats.map((seat) => (
                    <Grid item xs={12 / getGridColumns()} key={seat.seatNumber}>
                        <Tooltip
                            title={
                                <Box>
                                    <Typography variant="caption" display="block">
                                        Seat {seat.seatNumber}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                        Status: {getSeatLabel(seat)}
                                    </Typography>
                                    {seat.bookedBy && (
                                        <Typography variant="caption" display="block">
                                            Booked by: {seat.bookedBy}
                                        </Typography>
                                    )}
                                </Box>
                            }
                        >
                            <Paper
                                onClick={() => handleSeatClick(seat)}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    bgcolor: getSeatColor(seat),
                                    color: 'white',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: loading ? 'none' : 'scale(1.05)',
                                        boxShadow: 4
                                    },
                                    opacity: loading ? 0.6 : 1
                                }}
                            >
                                <Typography variant="h6" fontWeight={700}>
                                    {seat.seatNumber}
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                                    {getSeatLabel(seat)}
                                </Typography>
                            </Paper>
                        </Tooltip>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    Click on a seat to toggle between Full (Manual) and Vacant
                </Typography>
            </Box>
        </Box>
    );
};

export default SeatMap;
