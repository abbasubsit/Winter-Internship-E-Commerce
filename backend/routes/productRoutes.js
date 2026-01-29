import express from 'express';
import {
    createProduct,
    getProducts,
    getMyProducts,
    getTrendingProducts, // <--- Yahan naya function import kiya
    getProductById
} from '../controllers/productController.js';

import { protect, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/products/trending
// @desc    Get random/trending products
// Note: Isay hamesha '/:id' wale route se PEHLE rakhna chahiye
router.get('/trending', getTrendingProducts);

// Public (Get All) + Protected (Create)
router.route('/')
    .get(getProducts)
    .post(protect, seller, createProduct);

// Seller ke apne products
router.route('/myproducts')
    .get(protect, seller, getMyProducts);

// 4. Single Product Route (Dynamic route sabse last mein)
// ✅ YEH MISSING THA
router.route('/:id').get(getProductById);

export default router;