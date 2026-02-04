import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['customer', 'seller', 'admin'],
        default: 'customer'
    },
    //  NEW: Cart ko Database mein save karne ke liye
    cartItems: [
        {
            title: { type: String },
            qty: { type: Number, default: 1 },
            image: { type: String },
            price: { type: Number },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            _id: { type: String } // Frontend ID match karne ke liye
        }
    ]
}, { timestamps: true });

export default mongoose.model('User', userSchema);