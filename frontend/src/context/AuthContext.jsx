import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (token) {
            verifyToken(token, userType);
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async (token, userType) => {
        try {
            const response = await api.get('/auth/verify', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                if (userType === 'admin') {
                    setAdmin(response.data.user);
                } else {
                    setUser(response.data.user);
                }
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const loginCustomer = async (email, password) => {
        try {
            const response = await api.post('/auth/customer/login', { email, password });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userType', 'customer');
                setUser(response.data.user);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const signupCustomer = async (name, email, phone, password) => {
        try {
            const response = await api.post('/auth/customer/signup', {
                name,
                email,
                phone,
                password
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userType', 'customer');
                setUser(response.data.user);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const loginAdmin = async (username, password) => {
        try {
            const response = await api.post('/auth/admin/login', { username, password });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userType', 'admin');
                setAdmin(response.data.admin);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        setUser(null);
        setAdmin(null);
    };

    const value = {
        user,
        admin,
        loading,
        loginCustomer,
        signupCustomer,
        loginAdmin,
        logout,
        isAuthenticated: !!(user || admin),
        isAdmin: !!admin,
        isCustomer: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
