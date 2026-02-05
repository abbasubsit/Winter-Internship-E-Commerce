import express from 'express';
import {
    createProduct,
    getProducts,
    getMyProducts,
    getTrendingProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

import { protect, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

// Trending products route
router.get('/trending', getTrendingProducts);

// Public route to get all, Private to create
router.route('/')
    .get(getProducts)
    .post(protect, seller, createProduct);

// Seller's own products
router.route('/myproducts')
    .get(protect, seller, getMyProducts);

// Single product operations (Get, Edit, Delete)
router.route('/:id')
    .get(getProductById)
    .put(protect, seller, updateProduct)
    .delete(protect, seller, deleteProduct);

export default router;