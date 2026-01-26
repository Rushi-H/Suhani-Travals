import express from 'express';
import {
    customerSignup,
    customerLogin,
    adminLogin,
    verifyToken
} from '../controllers/authController.js';

const router = express.Router();

// Customer routes
router.post('/customer/signup', customerSignup);
router.post('/customer/login', customerLogin);

// Admin routes
router.post('/admin/login', adminLogin);

// Verify token
router.get('/verify', verifyToken);

export default router;
