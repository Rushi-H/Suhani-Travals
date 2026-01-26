import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    CheckCircle as AcceptIcon,
    Cancel as RejectIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';

const BookingTable = ({ bookings, onBookingUpdate }) => {
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAccept = async (booking) => {
        try {
            setLoading(true);
            const response = await api.put(`/admin/bookings/${booking._id}/status`, {
                status: 'Accepted'
            });

            if (response.data.success) {
                toast.success('Booking accepted! Notifications sent to customer.');
                onBookingUpdate();
            }
        } catch (error) {
            console.error('Error accepting booking:', error);
            toast.error(error.response?.data?.message || 'Failed to accept booking');
        } finally {
            setLoading(false);
        }
    };

    const handleRejectClick = (booking) => {
        setSelectedBooking(booking);
        setRejectDialogOpen(true);
    };

    const handleRejectConfirm = async () => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        try {
            setLoading(true);
            const response = await api.put(`/admin/bookings/${selectedBooking._id}/status`, {
                status: 'Rejected',
                rejectionReason
            });

            if (response.data.success) {
                toast.success('Booking rejected. Customer has been notified.');
                setRejectDialogOpen(false);
                setRejectionReason('');
                setSelectedBooking(null);
                onBookingUpdate();
            }
        } catch (error) {
            console.error('Error rejecting booking:', error);
            toast.error(error.response?.data?.message || 'Failed to reject booking');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            Pending: 'warning',
            Accepted: 'success',
            Rejected: 'error',
            Cancelled: 'default'
        };
        return colors[status] || 'default';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (!bookings || bookings.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No pending bookings at the moment
                </Typography>
            </Paper>
        );
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Customer</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contact</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Trip Details</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Seats</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Pickup</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Amount</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow
                                key={booking._id}
                                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                            >
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {booking.user.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{booking.user.phone}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {booking.user.email}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {booking.trip?.route?.from} → {booking.trip?.route?.to}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(booking.trip?.departureDate)} at {booking.trip?.departureTime}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                        {booking.seatNumbers.map((seat) => (
                                            <Chip
                                                key={seat}
                                                label={seat}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{booking.pickupLocation}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600} color="success.main">
                                        ₹{booking.payment.amount}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={booking.status}
                                        color={getStatusColor(booking.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {booking.status === 'Pending' && (
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            <Tooltip title="Accept Booking">
                                                <IconButton
                                                    color="success"
                                                    onClick={() => handleAccept(booking)}
                                                    disabled={loading}
                                                    size="small"
                                                >
                                                    <AcceptIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Reject Booking">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleRejectClick(booking)}
                                                    disabled={loading}
                                                    size="small"
                                                >
                                                    <RejectIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Reject Booking</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Please provide a reason for rejecting this booking. The customer will be notified.
                    </Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        multiline
                        rows={4}
                        label="Rejection Reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="e.g., Documents not verified, Duplicate booking, etc."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleRejectConfirm}
                        variant="contained"
                        color="error"
                        disabled={loading || !rejectionReason.trim()}
                    >
                        Reject Booking
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BookingTable;
