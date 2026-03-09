import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { BASE_URL } from "../services/api";

const ProductCard = React.memo(({ product }) => {
    const dispatch = useDispatch();

    if (!product) return null;

    const addToCartHandler = (e) => {
        e.preventDefault();
        dispatch(addToCart({ ...product, qty: 1 }));
        alert("Added to Cart!");
    };

    const price = product.price || 0;
    const originalPrice = product.price * 1.5;
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);


    return (
        <div className="group relative w-full overflow-hidden transition-all duration-300 hover:shadow-lg rounded-lg bg-white">

            {/* 1. IMAGE AREA - Full Width */}
            <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
                <Link to={`/product/${product._id}`} className="block w-full h-full">
                    <img
                        src={product.images && product.images[0] ? `${BASE_URL}${product.images[0]}` : "https://via.placeholder.com/300"}
                        alt={product.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </Link>

                {/* Floating Wishlist Button */}
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-300">
                    <Heart size={18} className="text-gray-600 hover:text-red-500" />
                </button>

                {/* Discount Badge (Clean) */}
                {discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        {discount}% OFF
                    </div>
                )}


                {/* Add to Cart Button (Bottom Overlay - Resized & Cleaner) */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={addToCartHandler}
                        className="w-full bg-black text-white py-2.5 text-sm font-medium rounded shadow-lg hover:bg-gray-800 flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={16} /> Add to Cart
                    </button>
                </div>
            </div>

            {/* 2. PRODUCT DETAILS - Clean & Minimal */}
            <div className="p-3 text-left">
                {/* Brand Name */}
                <p className="text-sm font-bold text-gray-900 mb-0.5">{product.brand || "Brand Name"}</p>

                {/* Title */}
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-sm text-gray-500 font-normal truncate hover:text-black transition">
                        {product.title || "Product Name"}
                    </h3>
                </Link>

                {/* Price Section */}
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-md font-bold text-gray-900">
                        PKR {price}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                        PKR {originalPrice.toFixed(0)}
                    </span>
                    <span className="text-xs font-bold text-green-600">
                        {discount}% off
                    </span>
                </div>
            </div>
        </div>
    );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;