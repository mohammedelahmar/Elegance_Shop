import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports
import userRoutes from './api/routes/userRoutes.js';
import productRoutes from './api/routes/productRoutes.js';
import categoryRoutes from './api/routes/categoryRoutes.js';
import wishlistRoutes from './api/routes/wishlistRoutes.js';
import paymentRoutes from './api/routes/paymentRoutes.js';
import commandeRoutes from './api/routes/commandeRoutes.js';
import addressesRoutes from './api/routes/addressesRoutes.js';
import varianteProductRoutes from './api/routes/varianteProductRoutes.js';
import reviewRoutes from './api/routes/reviewRoutes.js';
import cartRoutes from './api/routes/cartRoutes.js';

// Middleware imports
import errorMiddleware from './middlewares/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Basic Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', commandeRoutes);
app.use('/api/addresses', addressesRoutes);
app.use('/api/variants', varianteProductRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/commandes', commandeRoutes);

// API Documentation Route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    routes: {
      users: '/api/users',
      products: '/api/products',
      categories: '/api/categories',
      wishlist: '/api/wishlist',
      payment: '/api/payment',
      orders: '/api/orders',
      addresses: '/api/addresses',
      variants: '/api/variants',
      reviews: '/api/reviews',
      cart: '/api/cart'
    }
  });
});

// 404 Handler - For undefined routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Error Handler - Must be last middleware
app.use(errorMiddleware);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});