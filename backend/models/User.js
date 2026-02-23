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
    isVerified: {
        type: Boolean,
        default: false
    },
    // Cart items stored in the database for persistence
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
            _id: { type: String } // Match frontend-generated ID
        }
    ],
    // Forgot Password fields
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date }
}, { timestamps: true });

export default mongoose.model('User', userSchema);