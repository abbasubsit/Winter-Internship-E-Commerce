import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Taaki same naam ki 2 categories na ban jayein
        trim: true
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Yeh apne aap ko hi refer karega (Self-Reference)
        default: null    // Agar yeh "Main Category" hai, toh parent null hoga
    }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);