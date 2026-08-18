import asyncHandler from '../utils/asyncHandler.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { sendTokenResponse } from '../utils/generateToken.js';
import User from '../models/User.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user and include password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  });
});

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    user
  });
});

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isPasswordMatch = await user.comparePassword(req.body.currentPassword);

  if (!isPasswordMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Add shipping address
// @route   POST /api/auth/addresses
// @access  Private
export const addShippingAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  // If this is set as default, remove default from other addresses
  if (req.body.isDefault) {
    user.shippingAddresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  user.shippingAddresses.push(req.body);
  await user.save();

  res.status(201).json({
    success: true,
    addresses: user.shippingAddresses
  });
});

// @desc    Update shipping address
// @route   PUT /api/auth/addresses/:addressId
// @access  Private
export const updateShippingAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const address = user.shippingAddresses.id(req.params.addressId);

  if (!address) {
    return next(new ErrorResponse('Address not found', 404));
  }

  // If setting as default, remove default from others
  if (req.body.isDefault) {
    user.shippingAddresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  Object.assign(address, req.body);
  await user.save();

  res.status(200).json({
    success: true,
    addresses: user.shippingAddresses
  });
});

// @desc    Delete shipping address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private
export const deleteShippingAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  user.shippingAddresses.pull(req.params.addressId);
  await user.save();

  res.status(200).json({
    success: true,
    addresses: user.shippingAddresses
  });
});
