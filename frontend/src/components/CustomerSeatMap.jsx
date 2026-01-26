import React from 'react';
import { Box, Grid, Paper, Typography, Tooltip } from '@mui/material';

const CustomerSeatMap = ({ trip, selectedSeats, onSeatToggle }) => {
    const getSeatColor = (seat) => {
        if (selectedSeats.includes(seat.seatNumber)) return '#667eea'; // Purple - Selected
        if (seat.isBooked) return '#ef4444'; // Red - Booked
        return '#10b981'; // Green - Available
    };

    const isSeatAvailable = (seat) => {
        return !seat.isBooked;
    };

    const getGridColumns = () => {
        const totalSeats = trip.seats.length;
        if (totalSeats <= 7) return 3;
        if (totalSeats <= 12) return 4;
        return 5;
    };

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 24, height: 24, bgcolor: '#10b981', borderRadius: 1 }} />
                    <Typography variant="body2">Available</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 24, height: 24, bgcolor: '#667eea', borderRadius: 1 }} />
                    <Typography variant="body2">Selected</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 24, height: 24, bgcolor: '#ef4444', borderRadius: 1 }} />
                    <Typography variant="body2">Booked</Typography>
                </Box>
            </Box>

            <Grid container spacing={2}>
                {trip.seats.map((seat) => {
                    const isAvailable = isSeatAvailable(seat);
                    const isSelected = selectedSeats.includes(seat.seatNumber);

                    return (
                        <Grid item xs={12 / getGridColumns()} key={seat.seatNumber}>
                            <Tooltip
                                title={
                                    isAvailable
                                        ? isSelected
                                            ? 'Click to deselect'
                                            : 'Click to select'
                                        : 'Already booked'
                                }
                            >
                                <Paper
                                    onClick={() => isAvailable && onSeatToggle(seat.seatNumber)}
                                    sx={{
                                        p: 2.5,
                                        textAlign: 'center',
                                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                                        bgcolor: getSeatColor(seat),
                                        color: 'white',
                                        transition: 'all 0.3s ease',
                                        border: isSelected ? '3px solid #fff' : 'none',
                                        '&:hover': {
                                            transform: isAvailable ? 'scale(1.05)' : 'none',
                                            boxShadow: isAvailable ? 6 : 1
                                        },
                                        opacity: isAvailable ? 1 : 0.6
                                    }}
                                >
                                    <Typography variant="h5" fontWeight={700}>
                                        {seat.seatNumber}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                        {isAvailable ? (isSelected ? 'Selected' : 'Available') : 'Booked'}
                                    </Typography>
                                </Paper>
                            </Tooltip>
                        </Grid>
                    );
                })}
            </Grid>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                <Typography variant="body2" color="info.dark">
                    💡 <strong>Tip:</strong> Click on available (green) seats to select them. You can select multiple seats for group bookings.
                </Typography>
            </Box>
        </Box>
    );
};

export default CustomerSeatMap;
