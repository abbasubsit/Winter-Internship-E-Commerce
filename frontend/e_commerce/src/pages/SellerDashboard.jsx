import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard, Package, ShoppingBag, DollarSign, Plus,
    TrendingUp, Search, Trash2, Edit3, ArrowLeft, Loader, UploadCloud,
    Truck, CheckCircle, Clock, XCircle, AlertCircle
} from "lucide-react";

// ✅ CONFIG: Backend URL
const BASE_URL = "http://localhost:5000";

const SellerDashboard = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    // --- STATES ---
    const [activeTab, setActiveTab] = useState("overview");
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false); // To trigger re-fetch
    const [editingProduct, setEditingProduct] = useState(null);

    // Image URL Fixer
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/150";
        if (imagePath.startsWith("http")) return imagePath;
        return `${BASE_URL}${imagePath}`;
    };

    // 1. Sync URL
    useEffect(() => {
        if (location.pathname.includes("/seller/products")) setActiveTab("products");
        else if (location.pathname.includes("/seller/orders")) setActiveTab("orders");
        else setActiveTab("overview");
    }, [location]);

    // 2. Auth Check
    useEffect(() => {
        if (!userInfo || userInfo.role !== "seller") navigate("/");
    }, [userInfo, navigate]);

    // 3. Data Fetching
    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

                const { data: catData } = await axios.get(`${BASE_URL}/api/categories`);
                setCategories(catData);

                const { data: prodData } = await axios.get(`${BASE_URL}/api/products/myproducts`, config);
                setProducts(prodData);

                try {
                    const { data: orderData } = await axios.get(`${BASE_URL}/api/orders/sellerorders`, config);
                    setOrders(orderData);
                } catch (err) {
                    console.error("Orders fetch error:", err);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [userInfo, refresh]);

    // --- HANDLERS ---

    // Product Actions
    const handleDelete = async (id) => {
        if (window.confirm("Delete this product?")) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`${BASE_URL}/api/products/${id}`, config);
                setRefresh(!refresh);
            } catch (error) {
                alert("Delete Failed");
            }
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setActiveTab("edit_product");
    };

    // ✅ NEW: Order Status Update
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.put(`${BASE_URL}/api/orders/${orderId}/status`, { status: newStatus }, config);
            // Local state update taaki page refresh na karna pade
            const updatedOrders = orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            );
            setOrders(updatedOrders);
            alert(`Order marked as ${newStatus}`);
        } catch (error) {
            alert("Status Update Failed: " + (error.response?.data?.message || error.message));
        }
    };

    // --- COMPONENTS ---

    // 1. Sidebar
    const Sidebar = () => (
        <div className="w-64 bg-[#1c2434] min-h-screen hidden md:flex flex-col fixed h-full text-gray-300 shadow-xl z-20">
            <div className="h-20 flex items-center px-6 border-b border-gray-700 mb-4 bg-[#1c2434]">
                <div className="flex items-center gap-2 text-white font-bold text-xl">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg">S</div>
                    SellerHub
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4">Menu</p>
                <button onClick={() => { navigate("/seller/dashboard"); setActiveTab("overview"); }}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === "overview" ? "bg-gray-700 text-white shadow-md" : "hover:bg-gray-700 hover:text-white"}`}>
                    <LayoutDashboard size={20} className="mr-3" /> Dashboard
                </button>
                <button onClick={() => { navigate("/seller/products"); setActiveTab("products"); }}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === "products" ? "bg-gray-700 text-white shadow-md" : "hover:bg-gray-700 hover:text-white"}`}>
                    <Package size={20} className="mr-3" /> Products
                </button>
                <button onClick={() => { navigate("/seller/orders"); setActiveTab("orders"); }}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === "orders" ? "bg-gray-700 text-white shadow-md" : "hover:bg-gray-700 hover:text-white"}`}>
                    <ShoppingBag size={20} className="mr-3" /> Orders
                </button>
            </nav>

            <div className="p-4 border-t border-gray-700 bg-[#1c2434]">
                <button onClick={() => { setEditingProduct(null); setActiveTab("add_product"); }}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
                    <Plus size={20} className="mr-2" /> Add Product
                </button>
            </div>
        </div>
    );

    // 2. Orders List (Updated with Status Dropdown)
    const OrdersList = () => {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-fade-in">
                <div className="p-5 border-b border-gray-100 bg-white rounded-t-lg flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Manage Orders</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{orders.length} Orders</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Current Status</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {orders.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No orders received yet.</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-indigo-600">#{order._id.substring(0, 8)}</span>
                                            <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {order.customerId?.name || "Customer"}
                                            <p className="text-xs text-gray-400">{order.customerId?.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-800">Rs. {order.totalAmount}</td>

                                        {/* Status Badge */}
                                        <td className="px-6 py-4">
                                            {order.status === 'delivered' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1"><CheckCircle size={12} /> Delivered</span>}
                                            {order.status === 'shipped' && <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1"><Truck size={12} /> Shipped</span>}
                                            {order.status === 'pending' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1"><Clock size={12} /> Pending</span>}
                                            {order.status === 'cancelled' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1"><XCircle size={12} /> Cancelled</span>}
                                        </td>

                                        {/* Update Action Dropdown */}
                                        <td className="px-6 py-4">
                                            <select
                                                className="text-xs border border-gray-300 rounded p-1 bg-white focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                disabled={order.status === 'cancelled'} // Cancelled order update nahi hoga
                                            >
                                                <option value="pending">Mark Pending</option>
                                                <option value="shipped">Mark Shipped</option>
                                                <option value="delivered">Mark Delivered</option>
                                                <option value="cancelled">Cancel Order</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 3. Products List & Overview
    // (Pichle step wala code reuse kar rahe hain, bas structure maintain karne ke liye yahan shamil hai)
    const ProductsList = ({ limit, title }) => {
        const displayProducts = limit ? products.slice(0, limit) : products;
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-fade-in">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-lg">
                    <h2 className="text-lg font-bold text-gray-800">{title || "My Products"}</h2>
                    {!limit && (
                        <button onClick={() => { setEditingProduct(null); setActiveTab("add_product"); }} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition flex items-center shadow-sm">
                            <Plus size={16} className="mr-2" /> Add New
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold uppercase">Product</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase">Price</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase">Stock</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase">Category</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {displayProducts.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No products found.</td></tr>
                            ) : (
                                displayProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={getImageUrl(product.images?.[0])}
                                                    alt={product.title}
                                                    className="w-10 h-10 rounded object-cover border border-gray-200 bg-gray-100"
                                                    onError={(e) => { e.target.src = "https://via.placeholder.com/50" }}
                                                />
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.title}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">Rs. {product.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-medium ${product.stock < 5 ? 'text-red-600' : 'text-gray-600'}`}>
                                                {product.stock} {product.stock < 5 && '(Low)'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{product.category?.name || "General"}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEditClick(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDelete(product._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const Overview = () => {
        const totalSales = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        return (
            <div className="animate-fade-in space-y-8">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-[#1c2434] p-6 rounded-xl shadow-lg border border-gray-700 hover:translate-y-[-2px] transition-transform">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Total Sales</p>
                                <h3 className="text-2xl font-bold text-white">Rs. {totalSales.toLocaleString()}</h3>
                                <p className="text-green-400 text-xs mt-2 flex items-center"><TrendingUp size={12} className="mr-1" /> Updated just now</p>
                            </div>
                            <div className="p-3 bg-gray-700 rounded-lg text-green-400"><DollarSign size={24} /></div>
                        </div>
                    </div>
                    <div className="bg-[#1c2434] p-6 rounded-xl shadow-lg border border-gray-700 hover:translate-y-[-2px] transition-transform">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Total Orders</p>
                                <h3 className="text-2xl font-bold text-white">{orders.length}</h3>
                                <p className="text-blue-400 text-xs mt-2">Received orders</p>
                            </div>
                            <div className="p-3 bg-gray-700 rounded-lg text-blue-400"><ShoppingBag size={24} /></div>
                        </div>
                    </div>
                    <div className="bg-[#1c2434] p-6 rounded-xl shadow-lg border border-gray-700 hover:translate-y-[-2px] transition-transform">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Total Products</p>
                                <h3 className="text-2xl font-bold text-white">{products.length}</h3>
                                <p className="text-indigo-400 text-xs mt-2">Active listings</p>
                            </div>
                            <div className="p-3 bg-gray-700 rounded-lg text-indigo-400"><Package size={24} /></div>
                        </div>
                    </div>
                </div>
                <ProductsList limit={5} title="Recent Uploads" />
            </div>
        );
    };

    // 4. Product Form (Same)
    const ProductForm = () => {
        const [formData, setFormData] = useState({
            title: editingProduct?.title || "",
            price: editingProduct?.price || "",
            stock: editingProduct?.stock || "",
            category: editingProduct?.category?._id || editingProduct?.category || "",
            description: editingProduct?.description || "",
            image: editingProduct?.images?.[0] || ""
        });
        const [uploading, setUploading] = useState(false);

        const uploadFileHandler = async (e) => {
            const file = e.target.files[0];
            const fd = new FormData();
            fd.append("image", file);
            setUploading(true);
            try {
                const config = { headers: { "Content-Type": "multipart/form-data" } };
                const { data } = await axios.post(`${BASE_URL}/api/upload`, fd, config);
                setFormData({ ...formData, image: data.image });
                setUploading(false);
            } catch (error) {
                setUploading(false);
                alert("Image Upload Failed");
            }
        };

        const submitHandler = async (e) => {
            e.preventDefault();
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const payload = { ...formData, images: [formData.image] };
                if (editingProduct) {
                    await axios.put(`${BASE_URL}/api/products/${editingProduct._id}`, payload, config);
                    alert("Updated!");
                } else {
                    await axios.post(`${BASE_URL}/api/products`, payload, config);
                    alert("Created!");
                }
                setRefresh(!refresh);
                setActiveTab("products");
                navigate("/seller/products");
            } catch (error) {
                alert("Error: " + (error.response?.data?.message || error.message));
            }
        };

        return (
            <div className="max-w-4xl mx-auto animate-fade-in">
                <button onClick={() => setActiveTab("products")} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 font-medium"><ArrowLeft size={18} className="mr-2" /> Back to Products</button>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-sm font-semibold mb-2">Name</label><input type="text" required className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
                            <div><label className="block text-sm font-semibold mb-2">Category</label><select required className="w-full p-2.5 border border-gray-300 rounded-md bg-white" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-sm font-semibold mb-2">Price</label><input type="number" required className="w-full p-2.5 border border-gray-300 rounded-md" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></div>
                            <div><label className="block text-sm font-semibold mb-2">Stock</label><input type="number" required className="w-full p-2.5 border border-gray-300 rounded-md" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} /></div>
                        </div>
                        <div><label className="block text-sm font-semibold mb-2">Description</label><textarea required rows="4" className="w-full p-2.5 border border-gray-300 rounded-md" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea></div>
                        <div><label className="block text-sm font-semibold mb-2">Image</label><input type="file" onChange={uploadFileHandler} className="mb-2" />{uploading && <p className="text-xs text-blue-500 font-bold">Uploading...</p>}{formData.image && <img src={getImageUrl(formData.image)} alt="Preview" className="h-24 mt-2 rounded border" />}</div>
                        <div className="flex justify-end"><button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-md font-bold hover:bg-indigo-700 transition shadow-md">{editingProduct ? "Update" : "Publish"}</button></div>
                    </form>
                </div>
            </div>
        );
    };

    // --- MAIN RENDER ---
    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8">
                {loading ? <div className="flex justify-center mt-20"><Loader className="animate-spin text-indigo-600" size={40} /></div> : (
                    <>
                        {activeTab === "overview" && <Overview />}
                        {activeTab === "products" && <ProductsList />}
                        {activeTab === "orders" && <OrdersList />}
                        {(activeTab === "add_product" || activeTab === "edit_product") && <ProductForm />}
                    </>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;