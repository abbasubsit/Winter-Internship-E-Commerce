import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Loader, CheckCircle, MapPin, CreditCard, Package, AlertCircle, ImageOff } from "lucide-react";

const OrderDetailsPage = () => {
    const { id } = useParams();
    const { userInfo } = useSelector((state) => state.auth);

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            if (!userInfo) return;

            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, config);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, userInfo]);

    if (loading) return <div className="flex justify-center mt-20"><Loader className="animate-spin text-blue-600" size={40} /></div>;

    if (error) return (
        <div className="flex flex-col items-center justify-center mt-20 text-red-500">
            <AlertCircle size={48} className="mb-4" />
            <h2 className="text-xl font-bold">Error Loading Order</h2>
            <p>{error}</p>
            <Link to="/" className="mt-4 bg-gray-900 text-white px-6 py-2 rounded">Go Home</Link>
        </div>
    );

    if (!order) return <div className="text-center mt-20">Order not found.</div>;

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* Success Banner */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center text-green-800">
                <CheckCircle className="mr-3" size={24} />
                <div>
                    <h2 className="font-bold text-lg">Thank you! Your order has been placed.</h2>
                    <p className="text-sm">Order ID: <span className="font-mono font-bold">{order._id}</span></p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

                {/* LEFT SIDE: DETAILS */}
                <div className="md:col-span-2 space-y-6">

                    {/* Shipping */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800"><MapPin className="mr-2" size={20} /> Shipping</h2>
                        <p className="text-gray-600">
                            <strong className="text-gray-900">Name: </strong> {userInfo?.name} <br />
                            <strong className="text-gray-900">Email: </strong> {userInfo?.email} <br />
                            <strong className="text-gray-900">Address: </strong>
                            {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                        </p>
                        <div className={`mt-3 px-3 py-1 rounded inline-block text-sm font-bold ${order.isDelivered ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {order.isDelivered ? "Delivered" : "Not Delivered"}
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800"><CreditCard className="mr-2" size={20} /> Payment</h2>
                        <p className="text-gray-600">
                            <strong className="text-gray-900">Method: </strong> {order.paymentMethod}
                        </p>
                        <div className={`mt-3 px-3 py-1 rounded inline-block text-sm font-bold ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {order.isPaid ? "Paid" : "Not Paid"}
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800"><Package className="mr-2" size={20} /> Order Items</h2>
                        <div className="divide-y divide-gray-100">
                            {order.items?.map((item, index) => {
                                const product = item.productId || {};
                                const quantity = item.quantity;
                                // Image Logic: Check if valid image exists
                                const hasImage = product.images && product.images.length > 0;
                                const imageUrl = hasImage ? `http://localhost:5000${product.images[0]}` : null;

                                return (
                                    <div key={index} className="flex items-center py-4">
                                        {/* Safer Image Rendering */}
                                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded mr-4 overflow-hidden border border-gray-200 flex items-center justify-center">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={product.title || "Product"}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none'; // Hide broken image
                                                        e.target.parentElement.innerHTML = '<span class="text-xs text-gray-400">No Img</span>'; // Show text fallback
                                                    }}
                                                />
                                            ) : (
                                                <ImageOff className="text-gray-400" size={20} />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            {product._id ? (
                                                <Link to={`/product/${product._id}`} className="font-bold text-gray-800 hover:underline line-clamp-1">
                                                    {product.title}
                                                </Link>
                                            ) : (
                                                <span className="font-bold text-gray-400">Product Removed</span>
                                            )}

                                            <p className="text-sm text-gray-500 mt-1">
                                                {quantity} x ${item.price} = <strong>${(quantity * item.price).toFixed(2)}</strong>
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: SUMMARY */}
                <div className="h-fit">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>
                        <div className="space-y-3 text-gray-600">
                            <div className="flex justify-between"><span>Items</span><span>${order.itemsPrice || 0}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span>${order.shippingPrice || 0}</span></div>
                            <div className="flex justify-between"><span>Tax</span><span>${order.taxPrice || 0}</span></div>
                            <div className="border-t pt-3 flex justify-between font-bold text-xl text-gray-900">
                                <span>Total</span><span>${order.totalAmount || 0}</span>
                            </div>
                        </div>

                        <Link to="/" className="block w-full bg-gray-900 text-white text-center py-3 rounded mt-6 font-bold hover:bg-gray-800 transition">
                            Continue Shopping
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrderDetailsPage;