import express from 'express';
import { addOrderItems, getMyOrders, getSellerOrders, updateOrderStatus, getOrderById } from '../controllers/orderController.js';
import { protect, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new order
router.route('/').post(protect, addOrderItems);

// Get logged-in user's orders
router.route('/myorders').get(protect, getMyOrders);

// Get seller's orders (seller middleware ensures only sellers can access)
router.route('/sellerorders').get(protect, seller, getSellerOrders);

// Update order status (Seller only)
router.route('/:id/status').put(protect, seller, updateOrderStatus);

// Get order by ID (must be last to avoid matching named routes above)
router.route('/:id').get(protect, getOrderById);

export default router;