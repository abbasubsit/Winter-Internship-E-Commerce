import express from 'express';
import {
    getAllUsers,
    getAllSellers,
    getAllOrders,
    deleteUser,
    deleteProductAdmin,
    verifySeller
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect and admin middleware to all routes in this file
router.use(protect, admin);

router.get('/users', getAllUsers);
router.get('/sellers', getAllSellers);
router.get('/orders', getAllOrders);

router.delete('/users/:id', deleteUser);
router.put('/users/:id/verify', verifySeller); // ✅ Verify Seller Route
router.delete('/products/:id', deleteProductAdmin);

export default router;
