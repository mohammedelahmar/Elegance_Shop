import VarianteProduct from '../../models/VarianteProduct.js';
import Product from '../../models/Product.js';
import mongoose from 'mongoose';

/**
 * @desc    Get all variante products
 * @route   GET /api/variants
 * @access  Private
 */
const getVarianteProducts = async (req, res, next) => {
  try {
    const varianteProducts = await VarianteProduct.find({})
      .populate('product_id', 'name price image_url');
    
    res.status(200).json({
      success: true,
      count: varianteProducts.length,
      data: varianteProducts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new variante product
 * @route   POST /api/variants
 * @access  Private/Admin
 */
const createVarianteProduct = async (req, res, next) => {
  try {
    const { product_id, taille, couleur, stock } = req.body;

    // Check if product exists
    const productExists = await Product.findById(product_id);
    if (!productExists) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if this variant already exists
    const variantExists = await VarianteProduct.findOne({
      product_id,
      taille,
      couleur
    });

    if (variantExists) {
      res.status(400);
      throw new Error('This product variant already exists');
    }

    const varianteProduct = await VarianteProduct.create({
      product_id,
      taille,
      couleur,
      stock
    });

    res.status(201).json({
      success: true,
      data: varianteProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get variante product by ID
 * @route   GET /api/variants/:id
 * @access  Private
 */
const getVarianteProductById = async (req, res, next) => {
  try {
    const varianteProduct = await VarianteProduct.findById(req.params.id)
      .populate('product_id', 'name price image_url description');

    if (!varianteProduct) {
      res.status(404);
      throw new Error('Variant not found');
    }

    res.status(200).json({
      success: true,
      data: varianteProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get variante products by product ID
 * @route   GET /api/variants/product/:productId
 * @access  Private
 */
const getVarianteProductsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error('Invalid product ID format');
    }
    
    // Check if product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    const varianteProducts = await VarianteProduct.find({ product_id: productId })
      .populate('product_id', 'name price image_url');
    
    res.status(200).json({
      success: true,
      count: varianteProducts.length,
      data: varianteProducts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update variante product
 * @route   PUT /api/variants/:id
 * @access  Private/Admin
 */
const updateVarianteProduct = async (req, res, next) => {
  try {
    const { taille, couleur, stock } = req.body;

    let varianteProduct = await VarianteProduct.findById(req.params.id);

    if (!varianteProduct) {
      res.status(404);
      throw new Error('Variant not found');
    }

    varianteProduct = await VarianteProduct.findByIdAndUpdate(
      req.params.id,
      { taille, couleur, stock },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: varianteProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete variante product
 * @route   DELETE /api/variants/:id
 * @access  Private/Admin
 */
const deleteVarianteProduct = async (req, res, next) => {
  try {
    const varianteProduct = await VarianteProduct.findById(req.params.id);

    if (!varianteProduct) {
      res.status(404);
      throw new Error('Variant not found');
    }

    await varianteProduct.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Variant deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export {
  getVarianteProducts,
  createVarianteProduct,
  getVarianteProductById,
  getVarianteProductsByProduct,
  updateVarianteProduct,
  deleteVarianteProduct
};