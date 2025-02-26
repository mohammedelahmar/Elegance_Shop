import commande from "../../models/commande.js";
import ligneCommande from "../../models/ligneCommande.js";
import asyncHandler from 'express-async-handler';
import { protect as authMiddleware } from '../../middlewares/authMiddleware.js';
import adminMiddleware from '../../middlewares/adminMiddleware.js';

// @desc    Create new order
// @route   POST /api/commandes
// @access  Private

const addOrderItems = asyncHandler(async (req, res) => {
     const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

     if (orderItems && orderItems.lenght === 0){
          res.status(400);
          throw new Error('No order items');
          return;
     }
     else {
          const order = new commande({
               orderItems,
               user: req.user._id,
               shippingAddress,
               paymentMethod,
               itemsPrice,
               taxPrice,
               shippingPrice,
               totalPrice
          });

     }
     const createdOrder = await order.save();
     res.status(201).json(createdOrder);
     

}
);

// @desc    Get order by ID
// @route   GET /api/commandes/:id
// @access  Private

const getOrderById = asyncHandler(async (req, res) => {
     const order = await commande.findById(req.params.id).populate('user', 'name email');
     if (order){
          res.json(order);
     }else{
          res.status(404);
          throw new Error('Order not found');
     }
}
);

// @desc    Update order to paid
// @route   GET /api/commandes/:id/pay
// @access  Private

const updateOrderToPaid = asyncHandler(async (req, res) => {
     const order = await commande.findById(req.params.id);
     if (order){
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
               id: req.body.id,
               status: req.body.status,
               update_time: req.body.update_time,
               email_address: req.body.payer.email_address
          };
          const updatedOrder = await order.save();
          res.json(updatedOrder);
     }else{
          res.status(404);
          throw new Error('Order not found');
     }
}
);

// @desc    Update order to delivered
// @route   GET /api/commandes/:id/deliver
// @access  Private/Admin

const updateOrderToDelivered = asyncHandler(async (req, res) => {
     const order = await commande.findById(req.params.id);
     if (order){
          order.isDelivered = true;
          order.deliveredAt = Date.now();
          const updatedOrder = await order.save();
          res.json(updatedOrder);
     }else{
          res.status(404);
          throw new Error('Order not found');
     }
}
);

// @desc    Get logged in user orders
// @route   GET /api/commandes/myorders
// @access  Private

const getMyOrders = asyncHandler(async (req, res) => {
     const orders = await commande.find({ user: req.user._id });
     res.json(orders);
}
);

// @desc    Get all orders
// @route   GET /api/commandes
// @access  Private/Admin

const getOrders = asyncHandler(async (req, res) => {
     const orders = await commande.find({}).populate('user', 'id name');
     res.json(orders);
}
);

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered };



