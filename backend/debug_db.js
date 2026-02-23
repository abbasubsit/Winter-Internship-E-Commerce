import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';

const debug = async () => {
    try {
        console.log("Connecting to MongoDB...");
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is missing in .env file");
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        // Check Users
        const userCount = await User.countDocuments();
        console.log(`\nUsers Count: ${userCount}`);
        const seller = await User.findOne({ role: 'seller' });
        if (seller) {
            console.log(`   Seller found: ${seller.email} (ID: ${seller._id})`);
        } else {
            console.log("   No user with role 'seller' found. Seeder might fail.");
        }

        // Check Categories
        const categoryCount = await Category.countDocuments();
        console.log(`\nCategories Count: ${categoryCount}`);
        const categories = await Category.find({});
        if (categories.length > 0) {
            console.log(`   Sample Categories: ${categories.map(c => `${c.name} (${c._id})`).join(', ')}`);
        }

        // Check Products
        const productCount = await Product.countDocuments();
        console.log(`\nProducts Count: ${productCount}`);

        // List all databases to check if we are on the right server
        const admin = mongoose.connection.db.admin();
        const dbList = await admin.listDatabases();
        console.log("\nAvailable Databases on this Server:");
        dbList.databases.forEach(db => console.log(`   - ${db.name} (Size: ${db.sizeOnDisk})`));

        // Start checking collections in CURRENT db
        console.log(`\nCollections in current DB (${mongoose.connection.name}):`);
        const collections = await mongoose.connection.db.listCollections().toArray();
        collections.forEach(col => console.log(`   - ${col.name}`));


    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("\nDisconnected.");
    }
};

debug();
