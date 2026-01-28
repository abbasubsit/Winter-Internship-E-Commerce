import { useEffect, useState } from "react";
import axios from "axios";
import CartCarousel from "../HomeSectionCarosel/CartCarousel";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
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

    const groupedProducts = products.reduce((acc, product) => {
        const categoryName = product.category?.name || "Others";
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(product);
        return acc;
    }, {});

    if (loading) return <p className="text-center text-xl">Loading products...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            {Object.entries(groupedProducts).map(([categoryName, items]) => (
                <div key={categoryName} className="mb-12">
                    <CartCarousel data={items} sectionName={categoryName} />
                </div>
            ))}
        </div>
    );
};

export default HomePage;
