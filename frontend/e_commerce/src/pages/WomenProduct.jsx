import { useEffect, useState } from "react";
import axios from "axios";
// Path wahi rakha hai jo aapne Home page mein use kiya tha
import CartCarousel from "../HomeSectionCarosel/CartCarousel";

const WomenProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Backend se saare products fetch kar rahe hain
                const { data } = await axios.get("http://localhost:5000/api/products");
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // 1. Grouping Products by Category
    const groupedProducts = products.reduce((acc, product) => {
        const categoryName = product.category?.name || "Others";
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(product);
        return acc;
    }, {});

    // 2. FILTER LOGIC FOR WOMEN
    // Sirf wo categories rakhni hain jinke naam mein "women" aata ho.
    const womenCategories = Object.entries(groupedProducts).filter(([categoryName, items]) => {
        return categoryName.toLowerCase().includes("women");
    });

    if (loading) return <p className="text-center text-xl mt-10">Loading Women's Collection...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 px-4 border-l-4 border-pink-600">
                Women's Collection
            </h1>

            {womenCategories.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    <p>No products found for Women.</p>
                </div>
            ) : (
                womenCategories.map(([categoryName, items]) => (
                    <div key={categoryName} className="mb-12">
                        {/* Har category ke liye alag Carousel */}
                        <CartCarousel data={items} sectionName={categoryName} />
                    </div>
                ))
            )}
        </div>
    );
};

export default WomenProduct;