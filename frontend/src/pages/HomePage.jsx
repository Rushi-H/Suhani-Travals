import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Paper
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    EventSeat as BookingIcon,
    DirectionsBus as BusIcon
} from '@mui/icons-material';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                py: 4
            }}
        >
            <Container maxWidth="lg">
                <Paper
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: 4
                    }}
                >
                    <BusIcon sx={{ fontSize: 80, color: '#667eea', mb: 2 }} />
                    <Typography variant="h2" fontWeight={700} gutterBottom sx={{ color: '#667eea' }}>
                        Cab Booking System
                    </Typography>
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        Akluj ↔ Pune Route
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                        Book your comfortable ride between Akluj and Pune. Choose from our fleet of vehicles and reserve your seats instantly.
                    </Typography>

                    <Grid container spacing={4} sx={{ mt: 4 }}>
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 8
                                    }
                                }}
                                onClick={() => navigate('/booking')}
                            >
                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                    <BookingIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
                                    <Typography variant="h4" fontWeight={700} gutterBottom>
                                        Book a Ride
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                        Search available trips, select your seats, and book your journey
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        sx={{
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            py: 1.5
                                        }}
                                    >
                                        Start Booking
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 8
                                    }
                                }}
                                onClick={() => navigate('/admin')}
                            >
                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                    <DashboardIcon sx={{ fontSize: 64, color: '#667eea', mb: 2 }} />
                                    <Typography variant="h4" fontWeight={700} gutterBottom>
                                        Admin Panel
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                        Manage bookings, control seat availability, and monitor fleet status
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            py: 1.5
                                        }}
                                    >
                                        Admin Dashboard
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 6, p: 3, bgcolor: 'info.light', borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            🚌 Our Fleet
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body2">
                                    <strong>Maruti Suzuki Ertiga</strong><br />
                                    7 Seater - Comfortable for families
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body2">
                                    <strong>Tata Winger</strong><br />
                                    12 Seater - Perfect for groups
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body2">
                                    <strong>BharatBenz 1017</strong><br />
                                    20 Seater - Large capacity
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default HomePage;
