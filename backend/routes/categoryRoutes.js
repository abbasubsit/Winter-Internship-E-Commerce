import express from 'express';
const router = express.Router();
import { createCategory, getCategories } from '../controllers/categoryController.js';
import { protect, seller } from '../middleware/authMiddleware.js';

router.route('/').post(protect, seller, createCategory).get(getCategories);

export default router;