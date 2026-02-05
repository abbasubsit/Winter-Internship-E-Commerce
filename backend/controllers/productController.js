import Product from "../models/Product.js";

// @desc    Fetch all products (Public - Customer Side)
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        // ✅ FIX: .populate("category") zaroori hai.
        // Iske bina Frontend ko category ka "name" nahi milega.
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
        // Seller ke liye bhi populate kar rahe hain taaki Dashboard me category name dikhe
        // Hum 'sellerId' field use kar rahe hain jo aapke schema me hai
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

        // Aapke Schema me 'size' ek array hai object ka: [{ name: String, quantity: Number }]
        // Frontend se hum comma separated string "S, M, L" bhej rahe hain, usko convert karna padega
        let sizeArray = [];
        if (sizes && typeof sizes === 'string') {
            const sizeStringArray = sizes.split(',').map(s => s.trim());
            // Har size ke liye stock ko barabar baat rahe hain (Logic assumption based on your schema)
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
            category, // Ye Frontend se Category ID aani chahiye
            stock,
            images,
            brand,
            color,
            size: sizeArray,
            sellerId: req.user._id, // ✅ Schema ke mutabiq 'sellerId' use kiya hai
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
            // ✅ Check: Sirf wahi seller edit kar sake jisne banaya hai
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
            // ✅ Check: Sirf owner hi delete kar sake
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
        // Aggregate query plain objects deti hai, isliye Model.populate use karna padta hai
        await Product.populate(products, { path: "category" });
        res.json(products);
    } catch (error) {
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
    getTrendingProducts
};