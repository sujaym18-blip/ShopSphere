import asyncHandler from '../utils/asyncHandler.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorResponse('No order items provided', 400));
  }

  // Validate stock availability
  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(
        new ErrorResponse(`Product ${item.name} not found`, 404)
      );
    }

    if (product.stock < item.quantity) {
      return next(
        new ErrorResponse(
          `Insufficient stock for ${product.name}. Only ${product.stock} available`,
          400
        )
      );
    }
  }

  // Create order
  const order = await Order.create({
    user: req.user.id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  });

  // Update product stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  // Clear user cart
  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { items: [], subtotal: 0 }
  );

  res.status(201).json({
    success: true,
    order
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Make sure user owns the order or is admin
  if (
    order.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse('Not authorized to access this order', 403));
  }

  res.status(200).json({
    success: true,
    order
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    orders
  });
});

// @desc    Update order payment status
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Make sure user owns the order
  if (order.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this order', 403));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = 'Processing';
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address
  };

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    order: updatedOrder
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Filter by status if provided
  let query = {};
  if (req.query.status) {
    query.orderStatus = req.query.status;
  }

  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(query);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    orders
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderStatus, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  order.orderStatus = orderStatus || order.orderStatus;

  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  if (orderStatus === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    order: updatedOrder
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Make sure user owns the order
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to cancel this order', 403));
  }

  // Only allow cancellation of Pending or Processing orders
  if (!['Pending', 'Processing'].includes(order.orderStatus)) {
    return next(
      new ErrorResponse('Cannot cancel order in current status', 400)
    );
  }

  // Restore product stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity }
    });
  }

  order.orderStatus = 'Cancelled';
  await order.save();

  res.status(200).json({
    success: true,
    order
  });
});

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
export const getOrderStats = asyncHandler(async (req, res, next) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalPrice' }
      }
    }
  ]);

  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);

  res.status(200).json({
    success: true,
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    statusBreakdown: stats
  });
});
