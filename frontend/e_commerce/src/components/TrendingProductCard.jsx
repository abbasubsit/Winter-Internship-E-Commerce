import React from 'react';
import { Link } from 'react-router-dom';

// Note: Asal project mein niche wali 2 lines uncomment karein (Redux ke liye)
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice'; 

const TrendingProductCard = ({ product }) => {
    const dispatch = useDispatch();

    // 1. Image Path Handling (Database vs Local)
    // Agar product undefined hai to crash na ho
    if (!product) return null;

    const imageSrc = product.images && product.images.length > 0
        ? `http://localhost:5000${product.images[0]}`
        : 'https://via.placeholder.com/300';

    // 2. Add to Cart Handler
    const handleAddToCart = (e) => {
        e.preventDefault(); // Parent link click na ho
        // Asal project mein yeh use karein:
         dispatch(addToCart({ ...product, qty: 1 }));
        
    };

    const price = product.price || 0;
    // Fake original price logic for display
    const fakeOriginalPrice = product.discountedPrice ? product.price : (price * 1.2).toFixed(2);
    const displayPrice = product.discountedPrice || price;

    return (
        <div className="group relative flex flex-col items-start w-full">
            {/* Image Container */}
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-4 cursor-pointer">
                <Link to={`/product/${product._id}`}>
                    <img
                        src={imageSrc}
                        alt={product.title || "Product"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>

                {/* Heart Icon (Static for now) */}
                <button className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor" className="w-6 h-6 text-red-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>

                {/* Add to Cart Button */}
                <div className="absolute inset-x-4 bottom-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-[#1e293b] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#0f172a] shadow-xl"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        ADD TO CART
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="w-full">
                {/* Category Name handling */}
                <p className="text-red-500 font-medium text-xs mb-1 uppercase tracking-wide">
                    {product.category?.name || "Trending"}
                </p>
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-[#1e293b] font-bold text-lg leading-tight mb-2 truncate hover:text-blue-600 transition">
                        {product.title || "Product Title"}
                    </h3>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-[#1e293b] font-bold text-lg">${displayPrice}</span>
                    <span className="text-gray-400 text-sm line-through">${fakeOriginalPrice}</span>
                </div>
            </div>
        </div>
    );
};

export default TrendingProductCard;