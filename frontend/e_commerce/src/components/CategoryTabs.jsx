import React from 'react';

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

export default CategoryTabs;