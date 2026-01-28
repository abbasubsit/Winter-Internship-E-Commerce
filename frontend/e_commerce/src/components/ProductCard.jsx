import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";

// Note: Asal project mein niche wali 2 lines uncomment karein (Redux ke liye)
 import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    // Safety Check
    if (!product) return null;

    const addToCartHandler = (e) => {
        e.preventDefault(); // Click event ko parent Link tak jane se roko
        // Asal project mein yeh use karein:
         dispatch(addToCart({ ...product, qty: 1 }));
        alert("Added to Cart! (Uncomment Redux logic in real app)");
    };

    const price = product.price || 0;
    const fakeOriginalPrice = (price * 1.2).toFixed(2);

    return (
        <div className="group relative bg-card rounded-2xl border border-border hover:border-muted-foreground/20 overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
            {/* 1. IMAGE AREA */}
            <div className="relative aspect-square bg-muted/50 overflow-hidden">
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 z-10">
                    <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                        -20%
                    </span>
                </div>

                {/* Floating Actions (Right Side) */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="p-2.5 rounded-full shadow-md transition-all duration-200"
                     title="Add to Wishlist">
                        <Heart size={18} />
                    </button>
                   
                </div>

                {/* Main Image */}
                <Link to={`/product/${product._id}`} className="block w-full h-full">
                    <img
                        src={product.images && product.images[0] ? `http://localhost:5000${product.images[0]}` : "https://via.placeholder.com/300"}
                        alt={product.title}
                        className="w-full h-full object-cover p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>

                {/* Add to Cart Button (Bottom Overlay) */}
                <div className="absolute bottom-3 left-3 right-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-white">
                    <button
                        onClick={addToCartHandler}
                        className="w-full bg-foreground text-background py-3 my-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-foreground/90 shadow-lg active:scale-[0.98] transition-all bg-black"
                    >
                        <ShoppingCart size={18} /> Add to Cart
                    </button>
                </div>
            </div>

            {/* 2. PRODUCT DETAILS */}
            <div className="p-4">
                {/* Category */}
                <p className="text-sm font-bold text-red-400 text-product-category mb-1">{product.category?.name || "Collection"}</p>
                

                {/* Title */}
                <Link to={`/product/${product._id}`} className="block mb-2">
                    <h3 className="font-bold text-xl text-foreground mb-2 line-clamp-2">
                        {product.title || "Product Name"}
                    </h3>
                </Link>

               

                {/* Price Section */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-foreground">
                        ${price}
                    </span>
                    {fakeOriginalPrice && (
                        <span className="text-sm text-gray-400 text-muted-foreground line-through">
                            ${fakeOriginalPrice}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;