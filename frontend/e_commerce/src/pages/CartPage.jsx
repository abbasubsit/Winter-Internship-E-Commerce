import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { removeFromCart } from "../redux/cartSlice";

const CartPage = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Total Price Calculate Karo
    const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping'); // Future logic
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-xl text-gray-600 mb-4">Your cart is empty 😢</p>
                    <Link to="/" className="bg-yellow-400 px-6 py-2 rounded font-bold hover:bg-yellow-300">
                        Go Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Side: Cart Items */}
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex justify-between items-center bg-white p-4 rounded shadow">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={`http://localhost:5000${item.images[0]}`}
                                        alt={item.title}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div>
                                        <h3 className="font-bold">{item.title}</h3>
                                        <p className="text-gray-500">${item.price}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => dispatch(removeFromCart(item._id))}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Summary */}
                    <div className="bg-white p-6 rounded shadow h-fit border">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span>Items:</span>
                            <span>{cartItems.length}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold mb-4 border-t pt-2">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={checkoutHandler}
                            className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 transition font-bold"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;