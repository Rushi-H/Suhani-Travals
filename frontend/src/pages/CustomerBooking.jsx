import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    Search as SearchIcon,
    DirectionsBus as BusIcon,
    EventSeat as SeatIcon,
    AccessTime as TimeIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';
import socketService from '../services/socket';
import CustomerSeatMap from '../components/CustomerSeatMap';
import BookingForm from '../components/BookingForm';

const CustomerBooking = () => {
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [seatMapOpen, setSeatMapOpen] = useState(false);
    const [bookingFormOpen, setBookingFormOpen] = useState(false);

    const fetchTrips = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/trips?date=${searchDate}&from=Akluj&to=Pune`);
            if (response.data.success) {
                setTrips(response.data.trips);
            }
        } catch (error) {
            console.error('Error fetching trips:', error);
            toast.error('Failed to fetch available trips');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();

        // Real-time updates
        socketService.on('seat-updated', (data) => {
            console.log('Seat updated:', data);
            fetchTrips();
        });

        socketService.on('trip-updated', (data) => {
            console.log('Trip updated:', data);
            fetchTrips();
        });

        socketService.on('trip-status-updated', (data) => {
            console.log('Trip status updated:', data);
            fetchTrips();
        });

        return () => {
            socketService.removeAllListeners('seat-updated');
            socketService.removeAllListeners('trip-updated');
            socketService.removeAllListeners('trip-status-updated');
        };
    }, [searchDate]);

    const handleSelectSeats = (trip) => {
        setSelectedTrip(trip);
        setSelectedSeats([]);
        setSeatMapOpen(true);
    };

    const handleSeatToggle = (seatNumber) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatNumber)) {
                return prev.filter(s => s !== seatNumber);
            } else {
                return [...prev, seatNumber];
            }
        });
    };

    const handleProceedToBooking = () => {
        if (selectedSeats.length === 0) {
            toast.error('Please select at least one seat');
            return;
        }
        setSeatMapOpen(false);
        setBookingFormOpen(true);
    };

    const handleBookingSuccess = () => {
        setBookingFormOpen(false);
        setSelectedSeats([]);
        setSelectedTrip(null);
        fetchTrips();
        toast.success('Booking request submitted! Awaiting admin approval.');
    };

    const getAvailableSeatsCount = (trip) => {
        return trip.seats.filter(seat => !seat.isBooked).length;
    };

    const getStatusColor = (status) => {
        const colors = {
            Scheduled: 'success',
            Boarding: 'warning',
            Full: 'error',
            Departed: 'default'
        };
        return colors[status] || 'default';
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Paper sx={{ p: 3, mb: 4, background: 'rgba(255,255,255,0.95)' }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#667eea' }}>
                        🚌 Book Your Ride - Akluj to Pune
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Select your preferred trip and reserve your seats instantly
                    </Typography>
                </Paper>

                {/* Search Section */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Travel Date"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={<SearchIcon />}
                                onClick={fetchTrips}
                                disabled={loading}
                                sx={{ height: 56 }}
                            >
                                Search Trips
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Loading */}
                {loading && <LinearProgress sx={{ mb: 2 }} />}

                {/* Available Trips */}
                <Grid container spacing={3}>
                    {trips.map((trip) => {
                        const availableSeats = getAvailableSeatsCount(trip);
                        const occupancyPercentage = ((trip.bookedSeatsCount / trip.seats.length) * 100).toFixed(0);

                        return (
                            <Grid item xs={12} md={6} key={trip._id}>
                                <Card sx={{ height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <BusIcon sx={{ fontSize: 32, color: '#667eea' }} />
                                                <Box>
                                                    <Typography variant="h6" fontWeight={600}>
                                                        {trip.vehicle?.type}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {trip.vehicle?.registrationNumber}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Chip
                                                label={trip.status}
                                                color={getStatusColor(trip.status)}
                                                size="small"
                                            />
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <TimeIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    Departure: <strong>{trip.departureTime}</strong>
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <CalendarIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {new Date(trip.departureDate).toLocaleDateString('en-IN', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Seat Availability
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {availableSeats}/{trip.seats.length} available
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={occupancyPercentage}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: 'rgba(0,0,0,0.1)',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: occupancyPercentage >= 80 ? '#ef4444' : '#10b981',
                                                        borderRadius: 4
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h5" fontWeight={700} color="primary.main">
                                                ₹{trip.fare}
                                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                    per seat
                                                </Typography>
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<SeatIcon />}
                                                onClick={() => handleSelectSeats(trip)}
                                                disabled={availableSeats === 0 || !['Scheduled', 'Boarding'].includes(trip.status)}
                                            >
                                                {availableSeats === 0 ? 'Fully Booked' : 'Select Seats'}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}

                    {!loading && trips.length === 0 && (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 6, textAlign: 'center' }}>
                                <BusIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    No trips available for the selected date
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Try selecting a different date
                                </Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>

                {/* Seat Map Dialog */}
                <Dialog open={seatMapOpen} onClose={() => setSeatMapOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>
                        <Box>
                            <Typography variant="h6">Select Your Seats</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {selectedTrip?.vehicle?.type} - {selectedTrip?.departureTime}
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        {selectedTrip && (
                            <CustomerSeatMap
                                trip={selectedTrip}
                                selectedSeats={selectedSeats}
                                onSeatToggle={handleSeatToggle}
                            />
                        )}
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                            <Typography variant="body2" fontWeight={600}>
                                Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                            </Typography>
                            <Typography variant="h6" fontWeight={700} color="primary.main">
                                Total: ₹{selectedSeats.length * (selectedTrip?.fare || 0)}
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSeatMapOpen(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleProceedToBooking}
                            disabled={selectedSeats.length === 0}
                        >
                            Proceed to Booking ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Booking Form Dialog */}
                {selectedTrip && (
                    <BookingForm
                        open={bookingFormOpen}
                        onClose={() => setBookingFormOpen(false)}
                        trip={selectedTrip}
                        selectedSeats={selectedSeats}
                        onSuccess={handleBookingSuccess}
                    />
                )}
            </Container>
        </Box>
    );
};

export default CustomerBooking;
