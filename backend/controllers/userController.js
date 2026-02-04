import User from '../models/User.js';

// @desc    Sync/Save User Cart
// @route   PUT /api/users/cart
// @access  Private
const syncCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            user.cartItems = cartItems; // Cart update karo
            await user.save();
            res.json(user.cartItems);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get User Cart (Login ke baad)
// @route   GET /api/users/cart
// @access  Private
const getUserCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json(user.cartItems);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { syncCart, getUserCart };