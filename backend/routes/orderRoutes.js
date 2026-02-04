import express from 'express';
import { addOrderItems, getMyOrders, getSellerOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect,seller } from '../middleware/authMiddleware.js';

const router = express.Router();

// Order create karna
router.route('/').post(protect, addOrderItems);

// Apne orders dekhna
router.route('/myorders').get(protect, getMyOrders);

// ✅ NEW ROUTE FOR SELLER
// Isme 'seller' middleware zaroor lagayein taaki sirf seller access kare
router.route('/sellerorders').get(protect, seller, getSellerOrders);

// ✅ NEW: Status Update Route
router.route('/:id/status').put(protect, seller, updateOrderStatus);

export default router;