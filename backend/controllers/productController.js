import Product from "../models/Product.js";

// @desc    Fetch all products (Public - Customer Side)
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        // Populate category so the frontend gets the category name
        const products = await Product.find({}).populate("category");
        res.json(products);
    } catch (error) {
        console.error("Error in getProducts:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch logged-in seller's products (Private - Seller Dashboard)
// @route   GET /api/products/myproducts
const getMyProducts = async (req, res) => {
    try {
        // Populate category for seller dashboard display
        // Filter by 'sellerId' field from the schema
        const products = await Product.find({ sellerId: req.user._id }).populate("category");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product details
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product (Seller Only)
// @route   POST /api/products
const createProduct = async (req, res) => {
    try {
        const { title, description, price, category, stock, images, brand, color, sizes } = req.body;

        // Schema expects 'size' as array of objects: [{ name: String, quantity: Number }]
        // Frontend sends comma-separated string "S, M, L" — convert it here
        let sizeArray = [];
        if (sizes && typeof sizes === 'string') {
            const sizeStringArray = sizes.split(',').map(s => s.trim());
            // Distribute stock equally across sizes
            const qtyPerSize = Math.floor(stock / sizeStringArray.length) || 0;

            sizeArray = sizeStringArray.map(s => ({
                name: s,
                quantity: qtyPerSize
            }));
        }

        const product = new Product({
            title,
            description,
            price,
            category, // Category ID from frontend
            stock,
            images,
            brand,
            color,
            size: sizeArray,
            sellerId: req.user._id, // Assign the logged-in seller as owner
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product (Seller Only)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
    try {
        const { title, description, price, category, stock, images, brand, color, sizes } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            // Only the seller who created this product can edit it
            if (product.sellerId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: "Not authorized to edit this product" });
            }

            product.title = title || product.title;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            product.images = images || product.images;
            product.brand = brand || product.brand;
            product.color = color || product.color;

            // Size Update Logic
            if (sizes && typeof sizes === 'string') {
                const sizeStringArray = sizes.split(',').map(s => s.trim());
                const qtyPerSize = Math.floor((stock || product.stock) / sizeStringArray.length) || 0;
                product.size = sizeStringArray.map(s => ({
                    name: s,
                    quantity: qtyPerSize
                }));
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product (Seller Only)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Only the owner can delete this product
            if (product.sellerId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: "Not authorized to delete this product" });
            }

            await product.deleteOne();
            res.json({ message: "Product removed" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get trending products (Random 8)
// @route   GET /api/products/trending
const getTrendingProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([{ $sample: { size: 8 } }]);
        await Product.populate(products, { path: "category" });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search & filter products
// @route   GET /api/products/search?keyword=&category=&minPrice=&maxPrice=&brand=&color=&sort=
const searchProducts = async (req, res) => {
    try {
        const { keyword, category, minPrice, maxPrice, brand, color, sort } = req.query;

        const filter = {};

        // Text search on title and description
        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ];
        }

        // Category filter (by ID)
        if (category) {
            filter.category = category;
        }

        // Price range
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Brand filter
        if (brand) {
            filter.brand = { $regex: brand, $options: "i" };
        }

        // Color filter
        if (color) {
            filter.color = { $regex: color, $options: "i" };
        }

        // Sort options
        let sortOption = { createdAt: -1 }; // default: newest
        if (sort === "price_asc") sortOption = { price: 1 };
        else if (sort === "price_desc") sortOption = { price: -1 };
        else if (sort === "newest") sortOption = { createdAt: -1 };

        const products = await Product.find(filter)
            .populate("category")
            .sort(sortOption);

        res.json(products);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: error.message });
    }
};

export {
    getProducts,
    getMyProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getTrendingProducts,
    searchProducts
};