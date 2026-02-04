import Order from '../models/Order.js';
import Product from '../models/Product.js'; // Product model import karna zaroori hai

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const { orderItems, totalAmount } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // 1. STOCK CHECK & UPDATE LOGIC (Critical Step)
        // Hum har item ko check karenge ke stock hai ya nahi
        for (const item of orderItems) {
            const product = await Product.findById(item._id);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.title}` });
            }

            // Agar maangi gayi qty stock se zyada hai
            if (product.stock < item.qty) {
                return res.status(400).json({
                    message: `Out of Stock! ${product.title} only has ${product.stock} left.`
                });
            }

            // Stock Minus Karo
            product.stock = product.stock - item.qty;
            await product.save(); // Database update
        }

        // 2. Agar sab stock available hai, to Order Create karo
        const order = new Order({
            customerId: req.user._id,
            items: orderItems.map((item) => ({
                productId: item._id,
                quantity: item.qty,
                price: item.price,
            })),
            totalAmount,
            status: 'pending'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ NEW FUNCTION: Seller ke orders lane ke liye
// @desc    Get orders containing seller's products
// @route   GET /api/orders/sellerorders
// @access  Private (Seller)
const getSellerOrders = async (req, res) => {
    try {
        // 1. Pehle seller ke saare products dhoondo
        // Note: Aapke product schema me 'sellerId' use hua hai ya 'user', wo check karlena. 
        // Aapne jo schema bheja tha usme 'sellerId' tha.
        const products = await Product.find({ sellerId: req.user._id });

        // Un products ki IDs nikalo
        const productIds = products.map(p => p._id);

        // 2. Ab wo orders dhoondo jisme inme se koi bhi product ho
        const orders = await Order.find({
            'items.productId': { $in: productIds }
        })
            .populate('customerId', 'name email') // Customer ka naam dekhne ke liye
            .sort({ createdAt: -1 }); // Latest order pehle

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Order Status (Seller)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { addOrderItems, getMyOrders, getSellerOrders, updateOrderStatus };