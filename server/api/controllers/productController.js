import Product from "../../models/Product.js";
import asyncHandler from "express-async-handler";

//---------------------------------------------------------------------------------------------------------------------//

// @desc   Fetch all products with pagination, filtering and search
// @route  GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query object for filtering
  const queryObject = {};

  // Search by name
  if (req.query.keyword) {
    queryObject.name = { $regex: req.query.keyword, $options: 'i' };
  }

  // Filter by category
  if (req.query.category) {
    queryObject.category = req.query.category;
  }

  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    queryObject.price = {};
    if (req.query.minPrice) queryObject.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) queryObject.price.$lte = Number(req.query.maxPrice);
  }

  // Stock availability filter
  if (req.query.inStock === 'true') {
    queryObject.stock_quantity = { $gt: 0 };
  }

  // Execute query with pagination
  const products = await Product.find(queryObject)
    .limit(limit)
    .skip(skip)
    .sort(req.query.sortBy ? { [req.query.sortBy]: req.query.order === 'desc' ? -1 : 1 } : { createdAt: -1 });

  // Get total count for pagination data
  const totalProducts = await Product.countDocuments(queryObject);

  res.json({
    products,
    page,
    pages: Math.ceil(totalProducts / limit),
    totalProducts,
    hasMore: page * limit < totalProducts
  });
});

//---------------------------------------------------------------------------------------------------------------------//

// @desc   Fetch single product
// @route  GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//---------------------------------------------------------------------------------------------------------------------//

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed", productId: req.params.id });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//---------------------------------------------------------------------------------------------------------------------//

// @desc   Create a product
// @route  POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock_quantity, image_url, category } = req.body;

  // Basic validation
  if (!name || name.trim() === '') {
    res.status(400);
    throw new Error('Product name is required');
  }

  if (!price || isNaN(price) || price <= 0) {
    res.status(400);
    throw new Error('Valid product price is required');
  }

  if (!category) {
    res.status(400);
    throw new Error('Product category is required');
  }

  // Check if product with same name already exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    res.status(400);
    throw new Error('Product with this name already exists');
  }

  const product = new Product({
    name,
    description: description || '',
    price,
    stock_quantity: stock_quantity || 0,
    image_url: image_url || '',
    category
  });

  try {
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400);
    throw new Error(`Failed to create product: ${error.message}`);
  }
});

//---------------------------------------------------------------------------------------------------------------------//

// @desc   Update a product
// @route  PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock_quantity, image_url, category } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Basic validation
  if (price !== undefined && (isNaN(price) || price <= 0)) {
    res.status(400);
    throw new Error('Valid product price is required');
  }

  if (name !== undefined && name.trim() === '') {
    res.status(400);
    throw new Error('Product name cannot be empty');
  }

  // Check name uniqueness if changing name
  if (name && name !== product.name) {
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      res.status(400);
      throw new Error('Product with this name already exists');
    }
  }

  // Update fields if provided
  product.name = name || product.name;
  product.description = description !== undefined ? description : product.description;
  product.price = price !== undefined ? price : product.price;
  product.stock_quantity = stock_quantity !== undefined ? stock_quantity : product.stock_quantity;
  product.image_url = image_url || product.image_url;
  product.category = category || product.category;

  try {
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400);
    throw new Error(`Failed to update product: ${error.message}`);
  }
});

//---------------------------------------------------------------------------------------------------------------------//

// @desc   Get products by category
// @route  GET /api/products/category/:categoryId
// @access Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find({ category: categoryId })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const totalProducts = await Product.countDocuments({ category: categoryId });

  res.json({
    products,
    page,
    pages: Math.ceil(totalProducts / limit),
    totalProducts
  });
});

//---------------------------------------------------------------------------------------------------------------------//

// @desc   Update product stock quantity
// @route  PATCH /api/products/:id/stock
// @access Private/Admin
const updateProductStock = asyncHandler(async (req, res) => {
  const { stock_quantity } = req.body;
  
  if (stock_quantity === undefined || isNaN(stock_quantity) || stock_quantity < 0) {
    res.status(400);
    throw new Error('Valid stock quantity is required');
  }

  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  
  product.stock_quantity = stock_quantity;
  
  const updatedProduct = await product.save();
  res.json({
    _id: updatedProduct._id,
    name: updatedProduct.name,
    stock_quantity: updatedProduct.stock_quantity
  });
});

//---------------------------------------------------------------------------------------------------------------------//

export { 
  getProducts, 
  getProductById, 
  deleteProduct, 
  createProduct, 
  updateProduct,
  getProductsByCategory,
  updateProductStock
};
