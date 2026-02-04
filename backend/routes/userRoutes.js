import express from 'express';
import { syncCart, getUserCart } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Cart Sync Route
router.route('/cart')
    .put(protect, syncCart)  // Cart Save karo
    .get(protect, getUserCart); // Cart Fetch karo

export default router;