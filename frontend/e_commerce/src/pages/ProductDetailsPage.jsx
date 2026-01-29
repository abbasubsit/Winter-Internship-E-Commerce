import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Star, Minus, Plus, ChevronDown, ChevronUp, ShoppingBag, Heart } from "lucide-react";

// ✅ REAL IMPORTS (Redux is required for this logic)
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const ProductDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    // ✅ 1. Cart ka data nikalo taaki check kar sakein pehle se kitna hai
    const { cartItems } = useSelector((state) => state.cart);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // UI States
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState("");
    const [openSection, setOpenSection] = useState("description");

    // Fetch Product Data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setActiveImage(data.images[0]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
    if (!product) return <div className="flex justify-center items-center h-screen text-xl">Product not found</div>;

    // --- 🛠️ UPDATED ADD TO CART LOGIC ---
    const handleAddToCart = () => {
        // 1. Size Validation
        if (product.size && product.size.length > 0 && !selectedSize) {
            alert("Please select a size");
            return;
        }

        // 2. Calculate Available Stock
        let availableStock = product.stock;

        // Agar size specific stock hai
        if (selectedSize && product.size) {
            const sizeObj = product.size.find(s => s.name === selectedSize);
            if (sizeObj) {
                availableStock = sizeObj.quantity;
            }
        }

        // 3. Check Existing Quantity in Cart
        // Hum check kar rahe hain ke kya ye product pehle se cart mein hai?
        const existingItem = cartItems.find((item) => item._id === product._id);
        const currentQtyInCart = existingItem ? existingItem.qty : 0;

        // 4. Final Validation
        // Formula: (Jo Cart mein hai) + (Jo abhi maanga) > (Total Stock)
        if (currentQtyInCart + quantity > availableStock) {
            const remainingAllowed = availableStock - currentQtyInCart;
            alert(`Cannot add! You already have ${currentQtyInCart} in cart. Only ${remainingAllowed} more available.`);
            return; // Yahan ruk jao, Redux action fire mat karo
        }

        // 5. Success
        dispatch(addToCart({ ...product, qty: quantity, selectedSize }));
        alert("Added to Cart Successfully!");
    };

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? "" : section);
    };

    const imageSrc = (img) => {
        if (!img) return "https://via.placeholder.com/600";
        return img.startsWith("http") ? img : `http://localhost:5000${img}`;
    };

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* LEFT SIDE: IMAGE GALLERY */}
                    <div className="flex flex-col-reverse lg:flex-row gap-4">
                        <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible py-2 lg:py-0 scrollbar-hide">
                            {product.images && product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? "border-black" : "border-transparent hover:border-gray-200"
                                        }`}
                                >
                                    <img src={imageSrc(img)} alt="Thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 bg-gray-50 rounded-2xl overflow-hidden aspect-[4/5] relative group">
                            <img
                                src={imageSrc(activeImage)}
                                alt={product.title}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>

                    {/* RIGHT SIDE: PRODUCT INFO */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#111111] tracking-tight mb-2">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-2xl font-medium text-[#111111]">
                                    ${product.discountedPrice || product.price}
                                </span>
                                {product.discountedPrice && (
                                    <span className="text-lg text-gray-400 line-through">${product.price}</span>
                                )}
                            </div>
                        </div>

                        {/* Size Selection */}
                        {product.size && product.size.length > 0 && (
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wide">Select Size</h3>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                    {product.size.map((s) => (
                                        <button
                                            key={s.name}
                                            onClick={() => setSelectedSize(s.name)}
                                            disabled={s.quantity === 0}
                                            className={`py-3 rounded-md border text-sm font-medium transition-all ${selectedSize === s.name
                                                    ? "border-black bg-black text-white"
                                                    : "border-gray-200 text-[#111111] hover:border-black"
                                                } ${s.quantity === 0 ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`}
                                        >
                                            {s.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        <div className="mb-10 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 w-fit">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="text-gray-500 hover:text-black transition"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="mx-4 font-semibold w-6 text-center">{quantity < 10 ? `0${quantity}` : quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="text-gray-500 hover:text-black transition"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-[#111111] text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all flex justify-center items-center gap-2"
                                >
                                    <ShoppingBag size={20} /> Add to Bag
                                </button>
                                <button className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-300 hover:border-black transition text-[#111111]">
                                    <Heart size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Accordions */}
                        <div className="border-t border-gray-200">
                            <div className="border-b border-gray-200">
                                <button
                                    onClick={() => toggleSection("description")}
                                    className="w-full py-6 flex justify-between items-center text-left"
                                >
                                    <span className="text-lg font-bold text-[#111111]">Description</span>
                                    {openSection === "description" ? <ChevronUp /> : <ChevronDown />}
                                </button>
                                {openSection === "description" && (
                                    <div className="pb-6 text-gray-600 leading-relaxed">
                                        {product.description}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;