import React from 'react';

const TrendingProductCard = ({ product }) => {
    return (
        <div className="group relative flex flex-col items-start w-full">
            {/* Image Container */}
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-4 cursor-pointer">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Heart Icon */}
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>

                {/* Add to Cart Button (Visible on Hover) */}
                <div className="absolute inset-x-4 bottom-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button className="w-full bg-[#1e293b] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#0f172a] shadow-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        ADD TO CART
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="w-full">
                <p className="text-red-500 font-medium text-xs mb-1 uppercase tracking-wide">{product.category}</p>
                <h3 className="text-[#1e293b] font-bold text-lg leading-tight mb-2 truncate">{product.title}</h3>
                <div className="flex items-center gap-2">
                    <span className="text-[#1e293b] font-bold text-lg">${product.price}</span>
                    {product.originalPrice && (
                        <span className="text-gray-400 text-sm line-through">${product.originalPrice}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrendingProductCard;
