import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard, Users, ShoppingBag, Package, Trash2, Loader, LogOut
} from "lucide-react";
import { logout } from "../redux/authSlice"; // Adjust path if needed
import { useDispatch } from "react-redux";

const BASE_URL = "http://localhost:5000";

const AdminDashboard = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("overview");

    // ✅ Sync URL query params with Active Tab
    const location = useLocation();
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get("tab");
        if (tab) setActiveTab(tab);
    }, [location]);

    const [stats, setStats] = useState({ users: 0, sellers: 0, orders: 0, products: 0 });
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // ✅ Added Categories
    const [loading, setLoading] = useState(true);

    // Filter States
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        if (!userInfo || userInfo.role !== "admin") {
            navigate("/");
        } else {
            fetchData();
        }
    }, [userInfo, navigate]);

    // ✅ Image Helper (Same as Seller Dashboard)
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/150";
        if (imagePath.startsWith("http")) return imagePath;
        return `${BASE_URL}${imagePath}`;
    };

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            setLoading(true);

            // Fetch All Users
            const { data: usersData } = await axios.get(`${BASE_URL}/api/admin/users`, config);
            setUsers(usersData);

            // Fetch All Orders
            const { data: ordersData } = await axios.get(`${BASE_URL}/api/admin/orders`, config);
            setOrders(ordersData);

            // Fetch All Products
            const { data: productsData } = await axios.get(`${BASE_URL}/api/products`);
            setProducts(productsData);

            // ✅ Fetch Categories for Filter
            const { data: catData } = await axios.get(`${BASE_URL}/api/categories`);
            setCategories(catData);

            setStats({
                users: usersData.filter(u => u.role === 'customer').length,
                sellers: usersData.filter(u => u.role === 'seller').length,
                orders: ordersData.length,
                products: productsData.length
            });

            setLoading(false);
        } catch (error) {
            console.error("Admin Fetch Error:", error);
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure? This will delete the user and their data.")) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`${BASE_URL}/api/admin/users/${id}`, config);
                fetchData(); // Refresh list
            } catch (error) {
                alert("Failed to delete user");
            }
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Delete this product globally?")) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`${BASE_URL}/api/admin/products/${id}`, config);
                fetchData();
            } catch (error) {
                alert("Failed to delete product");
            }
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/"); // ✅ Redirect to Home
    };

    // --- SUB-COMPONENTS ---
    const Sidebar = () => (
        <div className="w-64 bg-gray-900 min-h-screen hidden md:flex flex-col fixed h-full text-gray-300 shadow-xl z-20">
            <div className="h-20 flex items-center px-6 border-b border-gray-800 mb-6 bg-gray-900">
                <div className="flex items-center gap-2 text-white font-bold text-xl">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">A</div>
                    AdminPanel
                </div>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                <button onClick={() => setActiveTab("overview")} className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === "overview" ? "bg-gray-800 text-white" : "hover:bg-gray-800"}`}><LayoutDashboard size={20} className="mr-3" /> Overview</button>
                <button onClick={() => setActiveTab("users")} className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === "users" ? "bg-gray-800 text-white" : "hover:bg-gray-800"}`}><Users size={20} className="mr-3" /> Users & Sellers</button>
                <button onClick={() => setActiveTab("orders")} className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === "orders" ? "bg-gray-800 text-white" : "hover:bg-gray-800"}`}><ShoppingBag size={20} className="mr-3" /> All Orders</button>
                <button onClick={() => setActiveTab("products")} className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === "products" ? "bg-gray-800 text-white" : "hover:bg-gray-800"}`}><Package size={20} className="mr-3" /> All Products</button>
            </nav>
            <div className="p-4 border-t border-gray-800">
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 transition"><LogOut size={20} className="mr-3" /> Logout</button>
            </div>
        </div>
    );

    const Overview = () => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><p className="text-gray-500 text-sm">Total Users</p><h3 className="text-3xl font-bold text-gray-800">{stats.users}</h3></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><p className="text-gray-500 text-sm">Total Sellers</p><h3 className="text-3xl font-bold text-indigo-600">{stats.sellers}</h3></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><p className="text-gray-500 text-sm">Total Products</p><h3 className="text-3xl font-bold text-green-600">{stats.products}</h3></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><p className="text-gray-500 text-sm">Total Orders</p><h3 className="text-3xl font-bold text-orange-600">{stats.orders}</h3></div>
        </div>
    );

    const UsersList = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 border-b">
                    <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Action</th></tr>
                </thead>
                <tbody className="divide-y">
                    {users.map(u => (
                        <tr key={u._id} className="hover:bg-gray-50">
                            <td className="p-4 font-medium">{u.name}</td>
                            <td className="p-4 text-gray-600">{u.email}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-red-100 text-red-600' :
                                    u.role === 'seller' ? 'bg-indigo-100 text-indigo-600' :
                                        'bg-green-100 text-green-600'
                                    }`}>
                                    {u.role}
                                </span>
                                { /* Show Status for Sellers */}
                                {u.role === 'seller' && (
                                    <span className={`ml-2 px-2 py-1 rounded text-xs font-bold uppercase ${u.isVerified ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-yellow-50 text-yellow-600 border border-yellow-200'}`}>
                                        {u.isVerified ? 'Verified' : 'Pending'}
                                    </span>
                                )}
                            </td>
                            <td className="p-4 flex items-center gap-2">
                                {/* Approve Button for Pending Sellers */}
                                {u.role === 'seller' && !u.isVerified && (
                                    <button
                                        onClick={async () => {
                                            if (window.confirm(`Approve ${u.name} as a Seller?`)) {
                                                try {
                                                    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                                                    await axios.put(`${BASE_URL}/api/admin/users/${u._id}/verify`, {}, config);
                                                    fetchData(); // Refresh to update status
                                                } catch (error) {
                                                    alert("Failed to verify seller");
                                                }
                                            }
                                        }}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700 transition"
                                    >
                                        Approve
                                    </button>
                                )}

                                {u.role !== 'admin' && (
                                    <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const OrdersList = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 border-b">
                    <tr><th className="p-4">Order ID</th><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Status</th></tr>
                </thead>
                <tbody className="divide-y">
                    {orders.map(o => (
                        <tr key={o._id}>
                            <td className="p-4 text-sm font-mono">{o._id}</td>
                            <td className="p-4 text-sm">{o.customerId?.name || 'Unknown'}</td>
                            <td className="p-4 font-bold">Rs. {o.totalAmount}</td>
                            <td className="p-4 capitalize">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                    o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {o.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const ProductsList = () => {
        // ✅ Filter Logic
        const filteredProducts = selectedCategory
            ? products.filter(p => (p.category?._id || p.category) === selectedCategory)
            : products;

        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Product Header with Filter */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="font-bold text-gray-700">All Products ({filteredProducts.length})</h2>
                    <select
                        className="p-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-white text-gray-600 border-b">
                        <tr><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Category</th><th className="p-4">Action</th></tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredProducts.map(p => (
                            <tr key={p._id} className="hover:bg-gray-50">
                                <td className="p-4 flex items-center gap-3">
                                    {/* ✅ User Image Helper */}
                                    <img src={getImageUrl(p.images?.[0])} className="w-10 h-10 rounded border object-cover" alt="" />
                                    <span className="font-medium text-sm max-w-[200px] truncate">{p.title}</span>
                                </td>
                                <td className="p-4 text-sm">Rs. {p.price}</td>
                                <td className="p-4 text-sm">{p.stock}</td>
                                <td className="p-4 text-sm text-gray-500">{p.category?.name || "General"}</td>
                                <td className="p-4"><button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><Trash2 size={18} /></button></td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">No products found for this category.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8">
                {loading ? <div className="flex justify-center mt-20"><Loader className="animate-spin text-gray-700" /></div> : (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-gray-800 capitalize">{activeTab.replace('_', ' ')}</h1>
                        {activeTab === 'overview' && <Overview />}
                        {activeTab === 'users' && <UsersList />}
                        {activeTab === 'orders' && <OrdersList />}
                        {activeTab === 'products' && <ProductsList />}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
