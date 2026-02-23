import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const createSeller = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        const sellerExists = await User.findOne({ email: 'seller@example.com' });

        if (sellerExists) {
            console.log("Seller already exists.");
            if (sellerExists.role !== 'seller') {
                console.log("User found but role is not seller. Updating role...");
                sellerExists.role = 'seller';
                await sellerExists.save();
                console.log("Role updated to seller.");
            }
        } else {
            console.log("Creating new seller...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456', salt);

            const seller = await User.create({
                name: 'Default Seller',
                email: 'seller@example.com',
                password: hashedPassword,
                role: 'seller'
            });
            console.log(`Seller created: ${seller.email} / 123456`);
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
};

createSeller();
