import asyncHandler from '../utils/asyncHandler.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate(
    'items.product',
    'name price stock images'
  );

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.status(200).json({
    success: true,
    cart
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  // Validate product exists and has stock
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  if (product.stock < quantity) {
    return next(
      new ErrorResponse(
        `Only ${product.stock} items available in stock`,
        400
      )
    );
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update quantity
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;

    if (newQuantity > product.stock) {
      return next(
        new ErrorResponse(
          `Only ${product.stock} items available in stock`,
          400
        )
      );
    }

    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images[0]?.url || '',
      quantity,
      stock: product.stock
    });
  }

  await cart.save();

  // Populate for response
  cart = await Cart.findById(cart._id).populate(
    'items.product',
    'name price stock images'
  );

  res.status(200).json({
    success: true,
    cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  const item = cart.items.id(req.params.itemId);

  if (!item) {
    return next(new ErrorResponse('Item not found in cart', 404));
  }

  // Validate stock
  const product = await Product.findById(item.product);

  if (quantity > product.stock) {
    return next(
      new ErrorResponse(
        `Only ${product.stock} items available in stock`,
        400
      )
    );
  }

  item.quantity = quantity;
  await cart.save();

  // Populate for response
  const updatedCart = await Cart.findById(cart._id).populate(
    'items.product',
    'name price stock images'
  );

  res.status(200).json({
    success: true,
    cart: updatedCart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  cart.items.pull(req.params.itemId);
  await cart.save();

  // Populate for response
  const updatedCart = await Cart.findById(cart._id).populate(
    'items.product',
    'name price stock images'
  );

  res.status(200).json({
    success: true,
    cart: updatedCart
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    cart
  });
});
