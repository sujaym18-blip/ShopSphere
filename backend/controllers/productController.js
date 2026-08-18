import asyncHandler from '../utils/asyncHandler.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import Product from '../models/Product.js';
import {
  uploadMultipleToCloudinary,
  deleteMultipleFromCloudinary
} from '../utils/cloudinaryUpload.js';

// @desc    Get all products with filters, search, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build query
  let query = {};

  // Search by name
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }

  // Filter by rating
  if (req.query.minRating) {
    query.ratings = { $gte: Number(req.query.minRating) };
  }

  // Filter featured products
  if (req.query.featured === 'true') {
    query.featured = true;
  }

  // Sort options
  let sortOptions = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { ratings: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }
  } else {
    sortOptions = { createdAt: -1 };
  }

  // Execute query
  const products = await Product.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    products
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    'reviews.user',
    'name avatar'
  );

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    product
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res, next) => {
  // Upload images to Cloudinary
  let images = [];
  if (req.files && req.files.length > 0) {
    images = await uploadMultipleToCloudinary(req.files, 'shopsphere/products');
  }

  const product = await Product.create({
    ...req.body,
    images,
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Handle image updates
  if (req.files && req.files.length > 0) {
    // Delete old images from Cloudinary
    if (product.images && product.images.length > 0) {
      const publicIds = product.images.map((img) => img.public_id);
      await deleteMultipleFromCloudinary(publicIds);
    }

    // Upload new images
    const newImages = await uploadMultipleToCloudinary(
      req.files,
      'shopsphere/products'
    );
    req.body.images = newImages;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Delete images from Cloudinary
  if (product.images && product.images.length > 0) {
    const publicIds = product.images.map((img) => img.public_id);
    await deleteMultipleFromCloudinary(publicIds);
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user.id.toString()
  );

  if (alreadyReviewed) {
    return next(new ErrorResponse('Product already reviewed', 400));
  }

  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;

  // Calculate average rating
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({
    success: true,
    message: 'Review added successfully'
  });
});

// @desc    Get product categories
// @route   GET /api/products/categories/all
// @access  Public
export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Product.distinct('category');

  res.status(200).json({
    success: true,
    categories
  });
});

// @desc    Get low stock products
// @route   GET /api/products/admin/low-stock
// @access  Private/Admin
export const getLowStockProducts = asyncHandler(async (req, res, next) => {
  const threshold = parseInt(req.query.threshold) || 10;

  const products = await Product.find({
    stock: { $lte: threshold, $gt: 0 }
  }).sort({ stock: 1 });

  res.status(200).json({
    success: true,
    count: products.length,
    products
  });
});
