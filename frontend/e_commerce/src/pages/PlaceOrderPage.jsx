import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import axios from "axios";

const PlaceOrderPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    // Calculations
    const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 200 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2)); // 15% Tax example
    const totalAmount = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate("/shipping");
        } else if (!cart.paymentMethod) {
            navigate("/payment");
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const placeOrderHandler = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const orderData = {
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalAmount,
            };

            // API Call to Backend
            // NOTE: Make sure your backend orderController accepts these fields!
            await axios.post("http://localhost:5000/api/orders", orderData, config);

            alert("Order Placed Successfully!");
            dispatch(clearCart());
            navigate("/"); // Redirect to Home or Order History
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">

                {/* LEFT COLUMN */}
                <div className="md:col-span-2 space-y-8">
                    {/* Shipping Info */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h2 className="text-2xl font-bold mb-4 text-[#111111]">Shipping</h2>
                        <p className="text-gray-600 mb-2"><strong>Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h2 className="text-2xl font-bold mb-4 text-[#111111]">Payment Method</h2>
                        <p className="text-gray-600"><strong>Method: </strong>{cart.paymentMethod}</p>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h2 className="text-2xl font-bold mb-4 text-[#111111]">Order Items</h2>
                        {cart.cartItems.length === 0 ? <p>Your cart is empty</p> : (
                            <div className="divide-y divide-gray-200">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center py-4">
                                        <img src={`http://localhost:5000${item.images[0]}`} alt={item.title} className="w-16 h-16 object-cover rounded mr-4" />
                                        <Link to={`/product/${item._id}`} className="flex-1 font-medium text-[#111111] hover:underline">
                                            {item.title}
                                        </Link>
                                        <div className="text-gray-600">
                                            {item.qty} x ${item.price} = <strong>${item.qty * item.price}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN - SUMMARY */}
                <div className="h-fit">
                    <div className="bg-white p-8 rounded-lg shadow border border-gray-100 sticky top-24">
                        <h2 className="text-2xl font-bold mb-6 text-[#111111] text-center">Order Summary</h2>

                        <div className="space-y-3 text-gray-700">
                            <div className="flex justify-between"><span>Items</span><span>${itemsPrice}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span>${shippingPrice}</span></div>
                            <div className="flex justify-between"><span>Tax</span><span>${taxPrice}</span></div>
                            <div className="border-t pt-3 flex justify-between font-bold text-xl text-[#111111]">
                                <span>Total</span><span>${totalAmount}</span>
                            </div>
                        </div>

                        <button
                            onClick={placeOrderHandler}
                            className="w-full bg-[#111111] text-white mt-6 py-3 rounded font-bold hover:bg-gray-800 transition"
                        >
                            Place Order
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PlaceOrderPage;