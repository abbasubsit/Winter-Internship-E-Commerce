import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Search } from "lucide-react";
import { searchProducts } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import ProductCard from "../components/ProductCard";

const ShopPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Data
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters (read from URL on mount)
    const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "");
    const [selectedColor, setSelectedColor] = useState(searchParams.get("color") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "newest");

    // UI state
    const [showFilters, setShowFilters] = useState(true);
    const [expandedSections, setExpandedSections] = useState({
        category: true, price: true, brand: false, color: false
    });

    // Load categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data);
            } catch (err) {
                console.error("Error loading categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products when filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {};
                if (keyword) params.keyword = keyword;
                if (selectedCategory) params.category = selectedCategory;
                if (minPrice) params.minPrice = minPrice;
                if (maxPrice) params.maxPrice = maxPrice;
                if (selectedBrand) params.brand = selectedBrand;
                if (selectedColor) params.color = selectedColor;
                if (sort) params.sort = sort;

                const data = await searchProducts(params);
                setProducts(data);

                // Sync filters to URL
                const urlParams = new URLSearchParams();
                Object.entries(params).forEach(([key, val]) => {
                    if (val) urlParams.set(key, val);
                });
                setSearchParams(urlParams, { replace: true });
            } catch (err) {
                console.error("Search error:", err);
            }
            setLoading(false);
        };

        const debounce = setTimeout(fetchProducts, 300);
        return () => clearTimeout(debounce);
    }, [keyword, selectedCategory, minPrice, maxPrice, selectedBrand, selectedColor, sort]);

    const clearAllFilters = () => {
        setKeyword("");
        setSelectedCategory("");
        setMinPrice("");
        setMaxPrice("");
        setSelectedBrand("");
        setSelectedColor("");
        setSort("newest");
    };

    const hasActiveFilters = keyword || selectedCategory || minPrice || maxPrice || selectedBrand || selectedColor;

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Get unique brands from products for the filter
    const allBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    const allColors = [...new Set(products.map(p => p.color).filter(Boolean))];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Top Bar */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">

                    {/* Search Input */}
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                        />
                        {keyword && (
                            <button onClick={() => setKeyword("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Filter Toggle (Mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition md:hidden"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                        </button>

                        {/* Sort Dropdown */}
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="px-4 py-2.5 bg-gray-100 rounded-full text-sm font-medium focus:outline-none cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price_asc">Price: Low → High</option>
                            <option value="price_desc">Price: High → Low</option>
                        </select>
                    </div>
                </div>

                {/* Active Filters Bar */}
                {hasActiveFilters && (
                    <div className="max-w-7xl mx-auto px-4 pb-3 flex flex-wrap gap-2 items-center">
                        <span className="text-xs text-gray-500 font-medium">Active:</span>
                        {keyword && (
                            <FilterTag label={`"${keyword}"`} onClear={() => setKeyword("")} />
                        )}
                        {selectedCategory && (
                            <FilterTag
                                label={categories.find(c => c._id === selectedCategory)?.name || "Category"}
                                onClear={() => setSelectedCategory("")}
                            />
                        )}
                        {(minPrice || maxPrice) && (
                            <FilterTag
                                label={`$${minPrice || 0} - $${maxPrice || "∞"}`}
                                onClear={() => { setMinPrice(""); setMaxPrice(""); }}
                            />
                        )}
                        {selectedBrand && (
                            <FilterTag label={selectedBrand} onClear={() => setSelectedBrand("")} />
                        )}
                        {selectedColor && (
                            <FilterTag label={selectedColor} onClear={() => setSelectedColor("")} />
                        )}
                        <button
                            onClick={clearAllFilters}
                            className="text-xs text-red-500 hover:text-red-700 font-medium ml-2"
                        >
                            Clear All
                        </button>
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

                {/* Sidebar Filters */}
                <aside className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
                    <div className="bg-white rounded-xl p-5 shadow-sm space-y-5 sticky top-28">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg">Filters</h3>
                            {hasActiveFilters && (
                                <button onClick={clearAllFilters} className="text-xs text-red-500 hover:underline">
                                    Reset
                                </button>
                            )}
                        </div>

                        {/* Category Filter */}
                        <FilterSection title="Category" expanded={expandedSections.category} onToggle={() => toggleSection("category")}>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={!selectedCategory}
                                        onChange={() => setSelectedCategory("")}
                                        className="accent-black"
                                    />
                                    All Categories
                                </label>
                                {categories.map(cat => (
                                    <label key={cat._id} className="flex items-center gap-2 cursor-pointer text-sm">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === cat._id}
                                            onChange={() => setSelectedCategory(cat._id)}
                                            className="accent-black"
                                        />
                                        {cat.name}
                                    </label>
                                ))}
                            </div>
                        </FilterSection>

                        {/* Price Range */}
                        <FilterSection title="Price Range" expanded={expandedSections.price} onToggle={() => toggleSection("price")}>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
                                />
                                <span className="text-gray-400 self-center">—</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
                                />
                            </div>
                            {/* Quick price buttons */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {[
                                    { label: "Under $50", min: "", max: "50" },
                                    { label: "$50-$100", min: "50", max: "100" },
                                    { label: "$100-$200", min: "100", max: "200" },
                                    { label: "$200+", min: "200", max: "" },
                                ].map(p => (
                                    <button
                                        key={p.label}
                                        onClick={() => { setMinPrice(p.min); setMaxPrice(p.max); }}
                                        className={`text-xs px-2.5 py-1 rounded-full border transition ${minPrice === p.min && maxPrice === p.max
                                                ? "bg-black text-white border-black"
                                                : "border-gray-300 hover:border-gray-500"
                                            }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </FilterSection>

                        {/* Brand Filter */}
                        {allBrands.length > 0 && (
                            <FilterSection title="Brand" expanded={expandedSections.brand} onToggle={() => toggleSection("brand")}>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                                        <input type="radio" name="brand" checked={!selectedBrand} onChange={() => setSelectedBrand("")} className="accent-black" />
                                        All Brands
                                    </label>
                                    {allBrands.map(b => (
                                        <label key={b} className="flex items-center gap-2 cursor-pointer text-sm">
                                            <input type="radio" name="brand" checked={selectedBrand === b} onChange={() => setSelectedBrand(b)} className="accent-black" />
                                            {b}
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>
                        )}

                        {/* Color Filter */}
                        {allColors.length > 0 && (
                            <FilterSection title="Color" expanded={expandedSections.color} onToggle={() => toggleSection("color")}>
                                <div className="flex flex-wrap gap-2">
                                    {allColors.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setSelectedColor(selectedColor === c ? "" : c)}
                                            className={`text-xs px-3 py-1.5 rounded-full border transition ${selectedColor === c
                                                    ? "bg-black text-white border-black"
                                                    : "border-gray-300 hover:border-gray-500"
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </FilterSection>
                        )}
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="flex-1">
                    {/* Results count */}
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            {loading ? "Searching..." : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl">
                            <p className="text-xl text-gray-400 font-medium mb-2">No products found</p>
                            <p className="text-sm text-gray-400">Try adjusting your filters or search term</p>
                            <button
                                onClick={clearAllFilters}
                                className="mt-4 px-6 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// --- Small Helper Components ---

const FilterSection = ({ title, expanded, onToggle, children }) => (
    <div className="border-t pt-4">
        <button onClick={onToggle} className="w-full flex items-center justify-between text-sm font-semibold mb-3">
            {title}
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded && children}
    </div>
);

const FilterTag = ({ label, onClear }) => (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-xs font-medium rounded-full">
        {label}
        <button onClick={onClear} className="hover:text-red-500">
            <X className="w-3 h-3" />
        </button>
    </span>
);

export default ShopPage;
