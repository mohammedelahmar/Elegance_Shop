import commande from "../../models/Commande.js";
import ligneCommande from "../../models/ligneCommande.js";
import asyncHandler from 'express-async-handler';
import Adresses from "../../models/Adresses.js";

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
    
    const order = new commande({
        orderItems,
        user_id: req.user._id,  // Changed from user to user_id to match model
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        total_amount: totalPrice  // Changed from totalPrice to total_amount to match model
    });
    
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/commandes/:id
// @access  Private

const getOrderById = asyncHandler(async (req, res) => {
     const order = await commande.findById(req.params.id)
          .populate('user_id', 'Firstname Lastname email')
          .populate({
               path: 'orderItems',
               populate: {
                    path: 'product',
                    select: 'name image_url price'
               }
          })
          .populate('shippingAddress');
          
     if (order){
          res.json(order);
     }else{
          throw new Error('Order not found');
     }
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
     const orders = await commande.find({ user: req.user._id });
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



