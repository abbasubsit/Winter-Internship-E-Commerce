import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// Redux imports (Uncomment in your local project)
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

// --- INTERNAL COMPONENT: CategoryTabs ---
const categories = [
    'All', 'Men\'s Kurta', 'T-Shirt', 'Jackets', 'Shoes', 'Hat'
];

const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border uppercase tracking-wider
            ${activeCategory === category
                            ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-lg scale-105'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800'
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

// --- INTERNAL COMPONENT: TrendingProductCard ---
const TrendingProductCard = ({ product }) => {
     const dispatch = useDispatch(); // Uncomment for Redux

    if (!product) return null;

    // Database vs Local Image logic
    const imageSrc = product.images && product.images.length > 0
        ? `http://localhost:5000${product.images[0]}`
        : 'https://via.placeholder.com/300';

    const handleAddToCart = (e) => {
        e.preventDefault();
        dispatch(addToCart({ ...product, qty: 1 })); // Uncomment for Redux
        alert("Added to Cart! (Enable Redux in local code)");
    };

    const price = product.price || 0;
    const fakeOriginalPrice = product.discountedPrice ? product.price : (price * 1.2).toFixed(2);
    const displayPrice = product.discountedPrice || price;

    return (
        <div className="group relative flex flex-col items-start w-full">
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-4 cursor-pointer">
                <Link to={`/product/${product._id}`}>
                    <img
                        src={imageSrc}
                        alt={product.title || "Product"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>

                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>

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

            <div className="w-full">
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

// --- MAIN COMPONENT: TrendingSection ---
const TrendingSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    // Effect: Jab bhi 'activeCategory' change ho, API se naya data mangwao
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let dataToDisplay = [];

                if (activeCategory === 'All') {
                    // Logic: Agar All hai, to 8 Random products mangwao
                    const { data } = await axios.get('http://localhost:5000/api/products/trending');
                    dataToDisplay = data;
                } else {
                    // Logic: Agar Category select hai, to SARE products mangwao
                    const { data } = await axios.get('http://localhost:5000/api/products');

                    // Frontend par filter karo
                    const filtered = data.filter(p =>
                        (p.category?.name && p.category.name.includes(activeCategory)) ||
                        (p.title && p.title.includes(activeCategory))
                    );

                    // Sirf pehle 8 dikhao (slice)
                    dataToDisplay = filtered.slice(0, 8);
                }

                setProducts(dataToDisplay);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeCategory]); // <-- Dependency array mein activeCategory hai

    return (
        <section className="bg-white py-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-[#1e293b] text-3xl md:text-4xl font-bold text-center mb-10">
                    Trending Now – Step Into Style
                </h2>

                <CategoryTabs
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading styles...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map(product => (
                            <TrendingProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No products found for {activeCategory}.</div>
                )}
            </div>
        </section>
    );
};

export default TrendingSection;