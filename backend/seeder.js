import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';

// 1. Import data files here
import mens_kurta from './Data/menskurtaData.js';
import mens_shoes from './Data/menshoesData.js';
import mens_jackets from './Data/mensjacketsData.js'
import mens_tshirt from './Data/menstshirtData.js'
import womens_bags from './Data/womensbagData.js';
import womens_shoes from './Data/womenshoesData.js';
import womens_tshirt from './Data/womenstshirtData.js';

dotenv.config();

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const seller = await User.findOne({ role: 'seller' });
        if (!seller) {
            console.log("Error: Seller not found.");
            process.exit(1);
        }

        // --- Helper function to import products by category ---
        const importCategoryData = async (categoryName, productList) => {
            // Check if the category already exists
            let category = await Category.findOne({ name: categoryName });

            if (!category) {
                // Create it if it doesn't exist
                category = await Category.create({ name: categoryName });
                console.log(`Created New Category: ${categoryName}`);
            }

            const formattedProducts = productList.map((product) => ({
                title: product.title,
                description: product.description,
                price: product.price,
                discountedPrice: product.discountedPrice,
                discountPersent: product.discountPersent,
                brand: product.brand,
                color: product.color,
                size: product.size,
                stock: product.quantity,
                images: [product.imageUrl],
                category: category._id,
                sellerId: seller._id,
            }));

            await Product.insertMany(formattedProducts);
            console.log(`Inserted ${formattedProducts.length} items into ${categoryName}`);
        };

        // --- 2. Import each category ---
        await importCategoryData("Men's Kurta", mens_kurta);
        await importCategoryData("Men's T-Shirts", mens_tshirt);
        await importCategoryData("Men's Jackets", mens_jackets);
        await importCategoryData("men's Shoes", mens_shoes);
        await importCategoryData("Women's Handbags", womens_bags);
        await importCategoryData("Women's Shoes", womens_shoes);
        await importCategoryData("Women's T-Shirts", womens_tshirt);

        console.log("All Data Imported Successfully!");
        process.exit();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();