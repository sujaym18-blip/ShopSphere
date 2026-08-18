import express from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js';
// import { protect } from '../middlewares/authMiddleware.js'; // add auth middleware if configured

const router = express.Router();

router.post('/order', createPaymentOrder);
router.post('/verify', verifyPayment);

export default router;