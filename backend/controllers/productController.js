import Product from '../models/Product.js';

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
export const createProduct = async (req, res) => {
    try {
        const { title, description, price, stock, category, images, brand, color, size, discountedPrice, discountPersent } = req.body;

        const product = new Product({
            title,
            description,
            price,
            stock,
            category,
            images,
            brand,
            color,
            size,
            discountedPrice,
            discountPersent,
            sellerId: req.user._id
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product: ' + error.message });
    }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('category', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get My Products (Seller)
// @route   GET /api/products/myproducts
// @access  Private/Seller
export const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.user._id });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get Trending Products
// @route   GET /api/products/trending
// @access  Public
export const getTrendingProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { $sample: { size: 8 } }
        ]);
        // Populate category for aggregated items
        await Product.populate(products, { path: 'category', select: 'name' });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        // Agar ID invalid hai (e.g. length kam hai)
        res.status(404).json({ message: 'Product not found' });
    }
};