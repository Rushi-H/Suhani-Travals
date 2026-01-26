import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Divider
} from '@mui/material';
import {
    DirectionsBus as BusIcon,
    Close as CloseIcon,
    EventSeat as SeatIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';
import SeatMap from './SeatMap';

const FleetCard = ({ trip, onTripUpdate }) => {
    const [seatMapOpen, setSeatMapOpen] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);

    const handleStatusChange = async (newStatus) => {
        try {
            setStatusLoading(true);
            const response = await api.patch(`/admin/trips/${trip._id}/status`, {
                status: newStatus
            });

            if (response.data.success) {
                toast.success(`Trip status updated to ${newStatus}`);
                onTripUpdate();
            }
        } catch (error) {
            console.error('Error updating trip status:', error);
            toast.error(error.response?.data?.message || 'Failed to update trip status');
        } finally {
            setStatusLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            Scheduled: 'info',
            Boarding: 'warning',
            Full: 'error',
            Departed: 'success',
            Completed: 'default',
            Cancelled: 'default'
        };
        return colors[status] || 'default';
    };

    const occupancyPercentage = (trip.bookedSeatsCount / trip.seats.length) * 100;

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                    }
                }}
            >
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <BusIcon sx={{ fontSize: 40, mr: 2 }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={700}>
                                {trip.vehicle?.type}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                {trip.vehicle?.name}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Occupancy</Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {trip.bookedSeatsCount}/{trip.seats.length} seats
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={occupancyPercentage}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'rgba(255,255,255,0.3)',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: occupancyPercentage >= 80 ? '#ef4444' : '#10b981',
                                    borderRadius: 4
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            Departure
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                            {trip.departureTime}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            Revenue
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                            ₹{trip.totalRevenue}
                        </Typography>
                    </Box>

                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel sx={{ color: 'white' }}>Trip Status</InputLabel>
                        <Select
                            value={trip.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={statusLoading}
                            sx={{
                                color: 'white',
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255,255,255,0.5)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255,255,255,0.8)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white'
                                },
                                '.MuiSvgIcon-root': {
                                    color: 'white'
                                }
                            }}
                        >
                            <MenuItem value="Scheduled">Scheduled</MenuItem>
                            <MenuItem value="Boarding">Boarding</MenuItem>
                            <MenuItem value="Full">Full</MenuItem>
                            <MenuItem value="Departed">Departed</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>

                    <Box
                        onClick={() => setSeatMapOpen(true)}
                        sx={{
                            p: 1.5,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            borderRadius: 2,
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.3)'
                            }
                        }}
                    >
                        <SeatIcon sx={{ mr: 1 }} />
                        <Typography variant="body2" component="span" fontWeight={600}>
                            View Seat Map
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Seat Map Dialog */}
            <Dialog
                open={seatMapOpen}
                onClose={() => setSeatMapOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6">{trip.vehicle?.type}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {trip.departureTime} | {trip.route.from} → {trip.route.to}
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setSeatMapOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <SeatMap trip={trip} onSeatUpdate={onTripUpdate} />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FleetCard;
