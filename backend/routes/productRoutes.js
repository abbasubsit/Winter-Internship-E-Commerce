import express from 'express';
import { createProduct,getProducts,getMyProducts} from '../controllers/productController.js';

import { protect, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public (Get All) + Protected (Create)
router.route('/')
    .get(getProducts)
    .post(protect, seller, createProduct);

// Seller ke apne products
router.route('/myproducts')
    .get(protect, seller, getMyProducts);

export default router;
