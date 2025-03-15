import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package
import userRoutes from './api/routes/userRoutes.js';
// import productRoutes from './api/routes/productRoutes.js';
import CategoryRoutes from './api/routes/categoryRoutes.js';
import ProductRoutes from './api/routes/productRoutes.js';

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/products', ProductRoutes);



// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});