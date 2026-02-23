import Order from '../models/Order.js';
import Product from '../models/Product.js';

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
        // Check stock availability for each item
        for (const item of orderItems) {
            const product = await Product.findById(item._id);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.title}` });
            }

            // If requested quantity exceeds available stock
            if (product.stock < item.qty) {
                return res.status(400).json({
                    message: `Out of Stock! ${product.title} only has ${product.stock} left.`
                });
            }

            // Deduct stock
            product.stock = product.stock - item.qty;
            await product.save();
        }

        // 2. If all stock is available, create the order
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

// Get orders that contain the seller's products
// @desc    Get orders containing seller's products
// @route   GET /api/orders/sellerorders
// @access  Private (Seller)
const getSellerOrders = async (req, res) => {
    try {
        // 1. Find all products belonging to this seller
        const products = await Product.find({ sellerId: req.user._id });

        // Extract product IDs
        const productIds = products.map(p => p._id);

        // 2. Find orders containing any of these products
        const orders = await Order.find({
            'items.productId': { $in: productIds }
        })
            .populate('customerId', 'name email')
            .sort({ createdAt: -1 }); // Most recent first

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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('customerId', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { addOrderItems, getMyOrders, getSellerOrders, updateOrderStatus, getOrderById };