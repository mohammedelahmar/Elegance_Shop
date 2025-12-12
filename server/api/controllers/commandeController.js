import commande from "../../models/Commande.js";
import ligneCommande from "../../models/ligneCommande.js";
import asyncHandler from 'express-async-handler';
import Adresses from "../../models/Adresses.js";
import Product from "../../models/Product.js";
import VarianteProduct from "../../models/VarianteProduct.js";

// @desc    Create new order
// @route   POST /api/commandes
// @access  Private

const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0){
        res.status(400);
        throw new Error('No order items');
    }
    
    // Verify the shipping address exists and belongs to the user
    const addressExists = await Adresses.findOne({ 
        _id: shippingAddress,
        user: req.user._id 
    });
    
    if (!addressExists) {
        res.status(400);
        throw new Error('Invalid shipping address');
    }
    
     const normalizedItems = [];

     for (const item of orderItems) {
          if (!item.product) {
               res.status(400);
               throw new Error('Each order item must reference a product.');
          }

          const product = await Product.findById(item.product);
          if (!product) {
               res.status(404);
               throw new Error('Product not found.');
          }

          const quantity = Number.parseInt(item.quantity, 10) || 1;
          if (quantity <= 0) {
               res.status(400);
               throw new Error('Quantity must be at least 1.');
          }

          if (product.stock_quantity < quantity) {
               res.status(400);
               throw new Error(`Insufficient stock for ${product.name}.`);
          }

          let variantId = null;
          if (item.variant) {
               const variant = await VarianteProduct.findById(item.variant);
               if (!variant) {
                    res.status(404);
                    throw new Error('Variant not found.');
               }

               if (variant.stock < quantity) {
                    res.status(400);
                    throw new Error('Insufficient stock for the selected variant.');
               }
               variantId = variant._id;
          }

          normalizedItems.push({
               product: product._id,
               quantity,
               variant: variantId,
               price: product.price
          });
     }

     const order = new commande({
          orderItems: normalizedItems,
          user_id: req.user._id,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          total_amount: totalPrice
     });
    
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/commandes/:id
// @access  Private

const getOrderById = asyncHandler(async (req, res) => {
     // First find the order
     const order = await commande.findById(req.params.id)
          .populate('user_id', 'Firstname Lastname email');
     
     if (!order) {
          res.status(404);
          throw new Error('Order not found');
     }
     
     // Get the shipping address
     let shippingAddressData = null;
     if (order.shippingAddress) {
          try {
               shippingAddressData = await Adresses.findById(order.shippingAddress);
          } catch (error) {
               console.error('Error fetching shipping address:', error);
          }
     }
     
     // Get the order items (ligne commandes)
     const orderItems = await ligneCommande.find({ commande_id: order._id })
          .populate('product_id', 'name image_url price');
     
     // Create a properly formatted response that matches what the frontend expects
     const orderData = {
          ...order._doc,
          user: {
               name: `${order.user_id?.Firstname || ''} ${order.user_id?.Lastname || ''}`.trim(),
               email: order.user_id?.email
          },
          shippingAddress: shippingAddressData ? {
               address: shippingAddressData.address,
               city: shippingAddressData.city,
               postalCode: shippingAddressData.postal_code,
               country: shippingAddressData.country
          } : null,
          orderItems: orderItems.map(item => ({
               _id: item._id,
               name: item.product_id.name,
               image: item.product_id.image_url,
               price: item.price_per_unit,
               product: item.product_id._id,
               quantity: item.quantity
          })),
          itemsPrice: orderItems.reduce((acc, item) => 
               acc + (item.price_per_unit * item.quantity), 0),
          totalPrice: order.total_amount,
          paymentMethod: order.payment_method
     };
     
     res.json(orderData);
});

// @desc    Update order to paid
// @route   PUT /api/commandes/:id/pay
// @access  Private/Admin

const updateOrderToPaid = asyncHandler(async (req, res) => {
     const order = await commande.findById(req.params.id);
     if (order){
          console.log('Before update:', order.isPaid, order.paidAt);
          order.isPaid = true;
          order.paidAt = Date.now();
          
          // Check if payer exists before trying to access email_address
          order.paymentResult = {
               id: req.body.id || 'admin-payment',
               status: req.body.status || 'completed',
               update_time: req.body.update_time || new Date().toISOString(),
               email_address: req.body.payer?.email_address || 'marked-by-admin'
          };
          
          const updatedOrder = await order.save();
          console.log('After update:', updatedOrder.isPaid, updatedOrder.paidAt);
          res.json(updatedOrder);
     } else {
          res.status(404);
          throw new Error('Order not found');
     }
});

// @desc    Update order to delivered
// @route   PUT /api/commandes/:id/deliver
// @access  Private/Admin

const updateOrderToDelivered = asyncHandler(async (req, res) => {
     const order = await commande.findById(req.params.id);
     if (order){
          order.isDelivered = true;
          order.deliveredAt = Date.now();
          const updatedOrder = await order.save();
          res.json(updatedOrder);
     } else {
          res.status(404);
          throw new Error('Order not found');
     }
});

// @desc    Get logged in user orders
// @route   GET /api/commandes/myorders
// @access  Private

const getMyOrders = asyncHandler(async (req, res) => {
     const orders = await commande.find({ user_id: req.user._id })
          .populate('user_id', 'Firstname Lastname email');
     
     // Send the orders to the client without trying to populate orderItems
     // We'll display the order summary data instead
     res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/commandes
// @access  Private/Admin

const getOrders = asyncHandler(async (req, res) => {
     const orders = await commande.find({}).populate('user_id', 'id Firstname Lastname email');
     res.json(orders);
});

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered };



