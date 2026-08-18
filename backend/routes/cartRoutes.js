import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.route('/').get(getCart).post(addToCart).delete(clearCart);

router.route('/:itemId').put(updateCartItem).delete(removeFromCart);

export default router;
