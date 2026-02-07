import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Loader, Package, AlertCircle, ArrowRight, XCircle, CheckCircle, Clock } from "lucide-react";

const MyOrdersPage = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        } else {
            const fetchMyOrders = async () => {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    };
                    // Backend route jo humne check kiya tha
                    const { data } = await axios.get("http://localhost:5000/api/orders/myorders", config);
                    setOrders(data);
                    setLoading(false);
                } catch (err) {
                    setError(err.response?.data?.message || err.message);
                    setLoading(false);
                }
            };
            fetchMyOrders();
        }
    }, [userInfo, navigate]);

    // Status Badge Helper
    const getStatusBadge = (isDelivered, status) => {
        // Agar backend me 'status' field string hai (like 'shipped') to wo check karo
        // Warna purana boolean check (isDelivered)
        if (status === 'cancelled') return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex items-center w-fit"><XCircle size={12} className="mr-1" /> Cancelled</span>;
        if (status === 'shipped') return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold flex items-center w-fit"><Package size={12} className="mr-1" /> Shipped</span>;
        if (isDelivered || status === 'delivered') return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center w-fit"><CheckCircle size={12} className="mr-1" /> Delivered</span>;

        return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold flex items-center w-fit"><Clock size={12} className="mr-1" /> Processing</span>;
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">My Order History</h1>

            {loading ? (
                <div className="flex justify-center mt-20"><Loader className="animate-spin text-indigo-600" size={40} /></div>
            ) : error ? (
                <div className="text-red-500 text-center mt-10 bg-red-50 p-4 rounded border border-red-200">{error}</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-bold text-gray-600">No orders found</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                    <Link to="/" className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition">Start Shopping</Link>
                </div>
            ) : (
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Order ID</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Date</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Total</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Payment</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Delivery Status</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-sm font-mono text-indigo-600 font-medium">
                                            #{order._id.substring(0, 10)}...
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-gray-800">
                                            ${order.totalAmount}
                                        </td>
                                        <td className="p-4 text-sm">
                                            {order.isPaid ? (
                                                <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded">Paid</span>
                                            ) : (
                                                <span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded">Pending</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(order.isDelivered, order.status)}
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                to={`/order/${order._id}`}
                                                className="text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-900 hover:text-white transition flex items-center w-fit"
                                            >
                                                Details <ArrowRight size={14} className="ml-1" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;