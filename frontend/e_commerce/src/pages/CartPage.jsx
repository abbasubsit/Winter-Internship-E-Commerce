import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { removeFromCart, decreaseQty, increaseQty } from "../redux/cartSlice";

const CartPage = () => {
    // 1. Redux se User Info bhi nikalo (Login status check karne ke liye)
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth); // ✅ Added this

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = total > 200 ? 0 : 15;
    const finalTotal = total + shipping;

    // ✅ FIXED: Smart Checkout Handler
    const checkoutHandler = () => {
        if (userInfo) {
            // Agar user pehle se logged in hai, to seedha Shipping page par jao
            navigate('/shipping');
        } else {
            // Agar login nahi hai, to Login page par bhejo
            navigate('/login?redirect=shipping');
        }
    }

    const handleIncreaseQty = (item) => {
        if (item.stock && item.qty >= item.stock) {
            alert(`Oops! Only ${item.stock} items available in stock.`);
            return;
        }
        dispatch(increaseQty(item._id));
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <h1 className="text-3xl font-extrabold mb-8 text-[#111111] tracking-tight">Your Bag</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl">
                    <p className="text-xl text-gray-500 mb-6 font-medium">Your bag is currently empty.</p>
                    <Link to="/" className="inline-block bg-[#111111] text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all transform hover:scale-105">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-12">

                    {/* LEFT SIDE: Cart Items List */}
                    <div className="md:col-span-2 space-y-8">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex gap-6 py-6 border-b border-gray-100 last:border-0">
                                {/* Product Image */}
                                <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                                    <img
                                        src={item.images && item.images[0] ? `http://localhost:5000${item.images[0]}` : "https://via.placeholder.com/150"}
                                        alt={item.title}
                                        className="w-full h-full object-cover mix-blend-multiply"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                                    />
                                    {item.stock && item.stock < 5 && (
                                        <span className="absolute bottom-1 right-1 bg-red-500 text-white text-[10px] px-1.5 rounded">
                                            Only {item.stock} left
                                        </span>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-[#111111] leading-tight max-w-[80%]">
                                                {item.title}
                                            </h3>
                                            <p className="text-lg font-bold text-[#111111]">${(item.price * item.qty).toFixed(2)}</p>
                                        </div>

                                        <p className="text-gray-500 text-sm mt-1 font-medium">
                                            {item.category?.name || "General"}
                                        </p>
                                        {item.brand && <p className="text-gray-400 text-sm">{item.brand}</p>}
                                        {item.selectedSize && <p className="text-gray-500 text-sm mt-1">Size: {item.selectedSize}</p>}
                                    </div>

                                    {/* Actions Row */}
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center border border-gray-300 rounded-full px-2 py-1">
                                                <button
                                                    onClick={() => dispatch(decreaseQty(item._id))}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition"
                                                    disabled={item.qty <= 1}
                                                >
                                                    <Minus size={14} strokeWidth={3} />
                                                </button>
                                                <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                                                <button
                                                    onClick={() => handleIncreaseQty(item)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition ${item.stock && item.qty >= item.stock
                                                            ? "text-gray-300 cursor-not-allowed"
                                                            : "text-gray-600 hover:text-black hover:bg-gray-100"
                                                        }`}
                                                    disabled={item.stock && item.qty >= item.stock}
                                                >
                                                    <Plus size={14} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => dispatch(removeFromCart(item._id))}
                                            className="text-gray-400 hover:text-red-600 transition p-2"
                                            title="Remove Item"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT SIDE: Summary Card */}
                    <div className="h-fit">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl sticky top-24">
                            <h2 className="text-2xl font-extrabold mb-6 text-[#111111]">Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Estimated Delivery & Handling</span>
                                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Tax</span>
                                    <span>$0.00</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-8">
                                <div className="flex justify-between text-xl font-extrabold text-[#111111]">
                                    <span>Total</span>
                                    <span>${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={checkoutHandler}
                                className="w-full bg-[#111111] text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all flex justify-center items-center gap-2 group"
                            >
                                Checkout <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;