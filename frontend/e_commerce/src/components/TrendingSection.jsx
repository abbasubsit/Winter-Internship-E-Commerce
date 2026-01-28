import React, { useState } from 'react';
import CategoryTabs from './CategoryTabs';
import TrendingProductCard from './TrendingProductCard';

const products = [
    {
        id: 1,
        title: 'Brown Graphic T-shirt',
        category: 'T-Shirt',
        price: 65,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 2,
        title: 'Casual Shoe',
        category: "Women's Coat",
        // Note: The image shows a coat/blazer but title is "Casual Shoe", replicating image text.
        // Wait, the image wrapper says "Women's Coat" but the text says "Casual Shoe". I will follow the image text literally, but it seems wrong. 
        // Actually the 2nd item in image is a coat. Title says "Casual Shoe". Price $120.
        // I will call it "Women's Coat" in category.
        price: 120,
        originalPrice: 150,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 3,
        title: 'White Lipstick Print T-Shirt',
        category: "Women's T-Shirt",
        price: 38,
        originalPrice: 55,
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 4,
        title: 'Yellow Tailored Blazer',
        category: "Women's Blazer",
        price: 85,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    // Adding more row 2 placeholders if needed, though image cuts off. I'll stick to 4 for now or duplicate.
    // Let's add 4 more to make it robust.
    {
        id: 5,
        title: 'Black & White Sneakers',
        category: 'Shoes',
        price: 95,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 6,
        title: 'Denim Jacket',
        category: 'Jackets',
        price: 110,
        image: 'https://images.unsplash.com/photo-1523205565295-f8e91625443c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 7,
        title: 'Leather Handbag',
        category: 'Accessories', // Not in filter?
        price: 240,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 8,
        title: 'Summer Hat',
        category: 'Hat',
        price: 45,
        image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    }

];

const TrendingSection = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredProducts = activeCategory === 'All'
        ? products
        : products.filter(p => p.category.includes(activeCategory) || (activeCategory === 'Shoes' && p.title.includes('Shoe')));

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <TrendingProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrendingSection;
