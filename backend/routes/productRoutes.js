import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategories,
  getLowStockProducts
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { productValidation } from '../middleware/validator.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/categories/all', getCategories);
router.get('/:id', getProductById);

// Protected routes
router.post('/:id/reviews', protect, createProductReview);

// Admin routes
router.post(
  '/',
  protect,
  authorize('admin'),
  upload.array('images', 5),
  productValidation,
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.array('images', 5),
  updateProduct
);

router.delete('/:id', protect, authorize('admin'), deleteProduct);

router.get('/admin/low-stock', protect, authorize('admin'), getLowStockProducts);

export default router;
