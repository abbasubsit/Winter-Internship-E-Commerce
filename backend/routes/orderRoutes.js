import express from 'express';
import { addOrderItems, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Order create karna
router.route('/').post(protect, addOrderItems);

// Apne orders dekhna
router.route('/myorders').get(protect, getMyOrders);

export default router;