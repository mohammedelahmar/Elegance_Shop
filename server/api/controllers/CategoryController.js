import Category from "../../models/Category.js";
import asyncHandler from "express-async-handler";


// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin

const createCategory = asyncHandler(async (req, res) => {
     const { name, description } = req.body;
     
     try {
       const category = new Category({ name, description });
       const createdCategory = await category.save();
       res.status(201).json(createdCategory);
     } catch (error) {
       if (error.code === 11000) {
         res.status(400);
         throw new Error('Category name already exists');
       }
       if (error.name === 'ValidationError') {
         res.status(400);
         throw new Error(Object.values(error.errors).map(val => val.message)[0]);
       }
       throw error;
     }
   });
// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name;
    category.description = description;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.deleteOne();
    res.json({ message: "Category removed" });
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

export {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
