import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, requireAdmin = false, requireCustomer = false }) => {
    const { user, admin, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (requireAdmin && !admin) {
        return <Navigate to="/admin/login" replace />;
    }

    if (requireCustomer && !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
