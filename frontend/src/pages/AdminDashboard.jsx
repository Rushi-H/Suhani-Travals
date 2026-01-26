import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    AppBar,
    Toolbar,
    Badge,
    IconButton,
    Chip,
    Button
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Refresh as RefreshIcon,
    Dashboard as DashboardIcon,
    Add as AddIcon,
    People as PeopleIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import socketService from '../services/socket';
import BookingTable from '../components/BookingTable';
import FleetCard from '../components/FleetCard';
import RevenueChart from '../components/RevenueChart';
import CreateTripDialog from '../components/CreateTripDialog';
import ManageDriverDialog from '../components/ManageDriverDialog';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [trips, setTrips] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pendingCount, setPendingCount] = useState(0);
    const [createTripOpen, setCreateTripOpen] = useState(false);
    const [manageDriverOpen, setManageDriverOpen] = useState(false);

    const navigate = useNavigate();
    const { logout, admin } = useAuth();

    const fetchBookings = async () => {
        try {
            const response = await api.get('/admin/bookings?status=Pending');
            if (response.data.success) {
                setBookings(response.data.bookings);
                setPendingCount(response.data.bookings.length);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to fetch bookings');
        }
    };

    const fetchTrips = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await api.get(`/admin/trips?date=${today}`);
            if (response.data.success) {
                setTrips(response.data.trips);
            }
        } catch (error) {
            console.error('Error fetching trips:', error);
            toast.error('Failed to fetch trips');
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/dashboard/stats');
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to fetch statistics');
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        await Promise.all([fetchBookings(), fetchTrips(), fetchStats()]);
        setLoading(false);
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    useEffect(() => {
        fetchAllData();

        // Set up Socket.io listeners for real-time updates
        socketService.on('new-booking', (data) => {
            console.log('New booking received:', data);
            toast.info('New booking request received!');
            fetchBookings();
            fetchStats();
        });

        socketService.on('booking-updated', (data) => {
            console.log('Booking updated:', data);
            fetchBookings();
            fetchStats();
        });

        socketService.on('seat-updated', (data) => {
            console.log('Seat updated:', data);
            fetchTrips();
            fetchStats();
        });

        socketService.on('trip-status-updated', (data) => {
            console.log('Trip status updated:', data);
            fetchTrips();
        });

        socketService.on('trip-updated', (data) => {
            console.log('Trip updated:', data);
            fetchTrips();
            fetchStats();
        });

        return () => {
            // Cleanup listeners
            socketService.removeAllListeners('new-booking');
            socketService.removeAllListeners('booking-updated');
            socketService.removeAllListeners('seat-updated');
            socketService.removeAllListeners('trip-status-updated');
            socketService.removeAllListeners('trip-updated');
        };
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* App Bar */}
            <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Toolbar>
                    <DashboardIcon sx={{ mr: 2, fontSize: 32 }} />
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        Cab Booking Admin Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 3, opacity: 0.9 }}>
                        Akluj ↔ Pune Route
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateTripOpen(true)}
                        sx={{ mr: 2, bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                    >
                        Create Trip
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<PeopleIcon />}
                        onClick={() => setManageDriverOpen(true)}
                        sx={{ mr: 2, borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                    >
                        Manage Drivers
                    </Button>
                    <IconButton color="inherit" onClick={fetchAllData} sx={{ mr: 1 }}>
                        <RefreshIcon />
                    </IconButton>
                    <IconButton color="inherit" sx={{ mr: 1 }}>
                        <Badge badgeContent={pendingCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <Button
                        variant="outlined"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header Stats */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <Typography variant="h3" fontWeight={700}>
                                {pendingCount}
                            </Typography>
                            <Typography variant="body2">Pending Requests</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                            <Typography variant="h3" fontWeight={700}>
                                {stats?.totalTrips || 0}
                            </Typography>
                            <Typography variant="body2">Today's Trips</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
                            <Typography variant="h3" fontWeight={700}>
                                ₹{stats?.totalRevenue || 0}
                            </Typography>
                            <Typography variant="body2">Total Revenue</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}>
                            <Typography variant="h3" fontWeight={700}>
                                {stats?.occupancyRate || 0}%
                            </Typography>
                            <Typography variant="body2">Occupancy Rate</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Main Content */}
                <Grid container spacing={3}>
                    {/* Pending Requests Section */}
                    <Grid item xs={12}>
                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h5" fontWeight={700}>
                                Pending Booking Requests
                            </Typography>
                            <Chip
                                label={`${pendingCount} Pending`}
                                color="warning"
                                sx={{ fontWeight: 600 }}
                            />
                        </Box>
                        <BookingTable bookings={bookings} onBookingUpdate={fetchAllData} />
                    </Grid>

                    {/* Live Fleet Status Section */}
                    <Grid item xs={12}>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                            Live Fleet Status
                        </Typography>
                        <Grid container spacing={3}>
                            {trips.map((trip) => (
                                <Grid item xs={12} md={4} key={trip._id}>
                                    <FleetCard trip={trip} onTripUpdate={fetchAllData} />
                                </Grid>
                            ))}
                            {trips.length === 0 && !loading && (
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography variant="h6" color="text.secondary">
                                            No trips scheduled for today
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>

                    {/* Daily Revenue Section */}
                    <Grid item xs={12}>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                            Daily Revenue Analytics
                        </Typography>
                        <RevenueChart stats={stats} />
                    </Grid>
                </Grid>
            </Container>

            {/* Create Trip Dialog */}
            <CreateTripDialog
                open={createTripOpen}
                onClose={() => setCreateTripOpen(false)}
                onSuccess={fetchAllData}
            />

            {/* Manage Driver Dialog */}
            <ManageDriverDialog
                open={manageDriverOpen}
                onClose={() => setManageDriverOpen(false)}
                onSuccess={fetchAllData}
            />
        </Box>
    );
};

export default AdminDashboard;
