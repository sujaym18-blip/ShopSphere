import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance lazily to ensure env vars are loaded
let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// 1. Create an Order on Razorpay Server
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR from frontend

    const options = {
      amount: Number(amount * 100), // Razorpay accepts amounts in paise (multiply INR by 100)
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayInstance = getRazorpayInstance();
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Verify Payment Signature (Security Check)
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create HMAC SHA256 digest using Razorpay Key Secret
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Database update: Mark order as isPaid: true, save payment_id
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};