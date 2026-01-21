import Product from '../models/Product.js';

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
export const createProduct = async (req, res) => {
    try {
        const { title, description, price, stock, category, images } = req.body;

        const product = new Product({
            title,
            description,
            price,
            stock,
            category,
            images, // Filhal hum image URLs string mein bhejenge manually
            sellerId: req.user._id // protect middleware se aata hai
        });

        const createdProduct = await product.save();
        return res.status(201).json(createdProduct);
    } catch (error) {
        return res
            .status(400)
            .json({ message: 'Error creating product: ' + error.message });
    }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        // populate = category ID ke bajaye full category object
        const products = await Product.find({})
            .populate('category', 'name');

        return res.json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Get My Products (Seller Dashboard)
// @route   GET /api/products/myproducts
// @access  Private/Seller
export const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.user._id });
        return res.json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
