import Review from '../../models/Review.js';
import Product from '../../models/Product.js';
import cloudinary from '../../config/cloudinary.js';
import multer from 'multer';
import path from 'path';

// Configure multer for temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${path.extname(file.originalname)}`);
  }
});

// Filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * @desc    Get reviews for a specific product
 * @route   GET /api/reviews/product/:id
 * @access  Public
 */
const getProductReviews = async (req, res, next) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    const reviews = await Review.find({ product_id: productId })
      .populate('user_id', 'Firstname Lastname');
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a review with optional image
 * @route   POST /api/reviews
 * @access  Private
 */
const addReview = async (req, res, next) => {
  try {
    const { product_id, rating, comment } = req.body;
    
    // Check if product exists
    const product = await Product.findById(product_id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product_id,
      user_id: req.user._id
    });
    
    if (existingReview) {
      res.status(400);
      throw new Error('You have already reviewed this product');
    }
    
    // Create review data
    const reviewData = {
      product_id,
      user_id: req.user._id,
      rating,
      comment
    };
    
    // Handle image upload if present
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'product_reviews',
        width: 1000,
        crop: "scale"
      });
      
      // Add image URL to review data
      reviewData.imageUrl = result.secure_url;
    }
    
    const review = await Review.create(reviewData);
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
const updateReview = async (req, res, next) => {
  try {
    const { rating, commentaire } = req.body;
    
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }
    
    // Check if the review belongs to the user
    if (review.user_id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You can only update your own reviews');
    }
    
    review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, commentaire },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }
    
    // Check if the review belongs to the user
    if (review.user_id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You can only delete your own reviews');
    }
    
    await review.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reviews (admin only)
 * @route   GET /api/reviews
 * @access  Private/Admin
 */
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .populate('user_id', 'Firstname Lastname email')
      .populate('product_id', 'name image_url');
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update review status (admin only)
 * @route   PUT /api/reviews/admin/:id
 * @access  Private/Admin
 */
const updateReviewStatus = async (req, res, next) => {
  try {
    const { approved } = req.body;
    
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }
    
    review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true, runValidators: true }
    ).populate('user_id', 'Firstname Lastname email')
      .populate('product_id', 'name image_url');
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

export {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  getAllReviews,
  updateReviewStatus
};