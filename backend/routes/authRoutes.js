import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerValidation,
  loginValidation
} from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

// Shipping addresses
router.post('/addresses', protect, addShippingAddress);
router.put('/addresses/:addressId', protect, updateShippingAddress);
router.delete('/addresses/:addressId', protect, deleteShippingAddress);

export default router;
