import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        discountedPrice: { type: Number },
        discountPersent: { type: Number },

        stock: { type: Number, required: true },
        brand: { type: String },
        color: { type: String },

        size: [
            {
                name: { type: String },
                quantity: { type: Number }
            }
        ],

        images: [{ type: String }],

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
)

export default mongoose.model("Product", productSchema)
