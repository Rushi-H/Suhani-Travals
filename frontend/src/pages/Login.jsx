import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Tabs,
    Tab,
    InputAdornment,
    IconButton
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Login as LoginIcon,
    DirectionsBus as BusIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [tab, setTab] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });

    const navigate = useNavigate();
    const { loginCustomer, loginAdmin } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let result;
            if (tab === 0) {
                // Customer login
                result = await loginCustomer(formData.email, formData.password);
                if (result.success) {
                    toast.success('Welcome back!');
                    navigate('/booking');
                }
            } else {
                // Admin login
                result = await loginAdmin(formData.username, formData.password);
                if (result.success) {
                    toast.success('Admin login successful!');
                    navigate('/admin');
                }
            }

            if (!result.success) {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
            <Container maxWidth="sm">
                <Paper sx={{ p: 4, borderRadius: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <BusIcon sx={{ fontSize: 64, color: '#667eea', mb: 2 }} />
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to continue
                        </Typography>
                    </Box>

                    <Tabs
                        value={tab}
                        onChange={(e, newValue) => setTab(newValue)}
                        variant="fullWidth"
                        sx={{ mb: 3 }}
                    >
                        <Tab label="Customer Login" />
                        <Tab label="Admin Login" />
                    </Tabs>

                    <form onSubmit={handleSubmit}>
                        {tab === 0 ? (
                            <TextField
                                fullWidth
                                required
                                type="email"
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                        ) : (
                            <TextField
                                fullWidth
                                required
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                        )}

                        <TextField
                            fullWidth
                            required
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            sx={{ mb: 3 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            startIcon={<LoginIcon />}
                            sx={{
                                py: 1.5,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                mb: 2
                            }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        {tab === 0 && (
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Don't have an account?{' '}
                                    <Link to="/signup" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600 }}>
                                        Sign Up
                                    </Link>
                                </Typography>
                            </Box>
                        )}
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
