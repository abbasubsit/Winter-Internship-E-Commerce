import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard, Package, ShoppingBag, DollarSign, Plus,
    TrendingUp, Search, Trash2, Edit3, ArrowLeft, Loader, UploadCloud,
    Truck, CheckCircle, Clock, XCircle
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
    const [refresh, setRefresh] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Image Helper
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

                // Fetch Categories
                const { data: catData } = await axios.get(`${BASE_URL}/api/categories`);
                console.log("📦 Categories Loaded:", catData); // Check Console: Electronics ka ID hai ya nahi?
                setCategories(catData);

                // Fetch Products
                const { data: prodData } = await axios.get(`${BASE_URL}/api/products/myproducts`, config);
                setProducts(prodData);

                // Fetch Orders
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

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.put(`${BASE_URL}/api/orders/${orderId}/status`, { status: newStatus }, config);
            const updatedOrders = orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            );
            setOrders(updatedOrders);
            alert(`Order marked as ${newStatus}`);
        } catch (error) {
            alert("Status Update Failed");
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
            <nav className="flex-1 px-4 space-y-2">
                <button onClick={() => { navigate("/seller/dashboard"); setActiveTab("overview"); }} className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === "overview" ? "bg-gray-700 text-white shadow-md" : "hover:bg-gray-700 hover:text-white"}`}><LayoutDashboard size={20} className="mr-3" /> Dashboard</button>
                <button onClick={() => { navigate("/seller/products"); setActiveTab("products"); }} className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === "products" ? "bg-gray-700 text-white shadow-md" : "hover:bg-gray-700 hover:text-white"}`}><Package size={20} className="mr-3" /> Products</button>
                <button onClick={() => { navigate("/seller/orders"); setActiveTab("orders"); }} className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === "orders" ? "bg-gray-700 text-white shadow-md" : "hover:bg-gray-700 hover:text-white"}`}><ShoppingBag size={20} className="mr-3" /> Orders</button>
            </nav>
            <div className="p-4 border-t border-gray-700 bg-[#1c2434]">
                <button onClick={() => { setEditingProduct(null); setActiveTab("add_product"); }} className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-lg active:scale-95"><Plus size={20} className="mr-2" /> Add Product</button>
            </div>
        </div>
    );

    // 2. Product Form (Fixed Validation)
    const ProductForm = () => {
        const [formData, setFormData] = useState({
            title: "", price: "", stock: "", category: "", description: "", image: "",
            brand: "", color: "", sizes: ""
        });
        const [uploading, setUploading] = useState(false);

        useEffect(() => {
            if (editingProduct) {
                const sizesString = editingProduct.size ? editingProduct.size.map(s => s.name).join(", ") : "";
                setFormData({
                    title: editingProduct.title || "",
                    price: editingProduct.price || "",
                    stock: editingProduct.stock || "",
                    category: editingProduct.category?._id || editingProduct.category || "",
                    description: editingProduct.description || "",
                    image: editingProduct.images?.[0] || "",
                    brand: editingProduct.brand || "",
                    color: editingProduct.color || "",
                    sizes: sizesString
                });
            } else {
                setFormData({ title: "", price: "", stock: "", category: "", description: "", image: "", brand: "", color: "", sizes: "" });
            }
        }, [editingProduct]);

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

            // ✅ CRITICAL VALIDATION
            if (!formData.category) {
                alert("Please select a Category from the list!");
                return;
            }

            console.log("📝 Submitting Form Data:", formData); // Debug

            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const payload = { ...formData, images: [formData.image] };

                if (editingProduct) {
                    await axios.put(`${BASE_URL}/api/products/${editingProduct._id}`, payload, config);
                    alert("Product Updated Successfully");
                } else {
                    await axios.post(`${BASE_URL}/api/products`, payload, config);
                    alert("Product Created Successfully");
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
                            <div><label className="block text-sm font-semibold mb-2">Product Name</label><input type="text" required className="w-full p-2.5 border rounded" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>

                            {/* ✅ Category Dropdown */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Category <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    className="w-full p-2.5 border rounded bg-white"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">-- Select Category --</option>
                                    {categories.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-sm font-semibold mb-2">Price (Rs.)</label><input type="number" required className="w-full p-2.5 border rounded" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></div>
                            <div><label className="block text-sm font-semibold mb-2">Total Stock</label><input type="number" required className="w-full p-2.5 border rounded" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} /></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-sm font-semibold mb-2">Brand</label><input type="text" className="w-full p-2.5 border rounded" placeholder="e.g. Nike" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} /></div>
                            <div><label className="block text-sm font-semibold mb-2">Color</label><input type="text" className="w-full p-2.5 border rounded" placeholder="e.g. Red" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} /></div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Sizes (Comma separated)</label>
                            <input type="text" className="w-full p-2.5 border rounded" placeholder="S, M, L, XL" value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} />
                            <p className="text-xs text-gray-500 mt-1">For Electronics, leave empty.</p>
                        </div>

                        <div><label className="block text-sm font-semibold mb-2">Description</label><textarea required rows="4" className="w-full p-2.5 border rounded" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea></div>
                        <div><label className="block text-sm font-semibold mb-2">Image</label><input type="file" onChange={uploadFileHandler} className="mb-2" />{uploading && <p className="text-xs text-blue-500 font-bold">Uploading...</p>}{formData.image && <img src={getImageUrl(formData.image)} alt="Preview" className="h-24 mt-2 rounded border" />}</div>
                        <div className="flex justify-end"><button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-md font-bold hover:bg-indigo-700 transition shadow-md">{editingProduct ? "Update" : "Publish"}</button></div>
                    </form>
                </div>
            </div>
        );
    };

    // ... (ProductsList, OrdersList, Overview - Same as before, keeping them concise)
    const ProductsList = ({ limit, title }) => {
        const displayProducts = limit ? products.slice(0, limit) : products;
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-lg"><h2 className="text-lg font-bold text-gray-800">{title || "My Products"}</h2>{!limit && <button onClick={() => { setEditingProduct(null); setActiveTab("add_product"); }} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center"><Plus size={16} className="mr-2" /> Add New</button>}</div>
                <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead className="bg-gray-50 text-gray-600"><tr><th className="px-6 py-3 text-xs font-bold uppercase">Product</th><th className="px-6 py-3 text-xs font-bold uppercase">Price</th><th className="px-6 py-3 text-xs font-bold uppercase">Stock</th><th className="px-6 py-3 text-xs font-bold uppercase">Category</th><th className="px-6 py-3 text-xs font-bold uppercase text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100 bg-white">{displayProducts.map(p => (<tr key={p._id} className="hover:bg-gray-50"><td className="px-6 py-4 flex items-center gap-3"><img src={getImageUrl(p.images?.[0])} className="w-10 h-10 rounded border" alt="" /><span className="text-sm font-medium">{p.title}</span></td><td className="px-6 py-4 text-sm">Rs. {p.price}</td><td className="px-6 py-4 text-sm">{p.stock}</td><td className="px-6 py-4 text-sm text-gray-500">{p.category?.name || "General"}</td><td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEditClick(p)} className="text-blue-600 p-2"><Edit3 size={16} /></button><button onClick={() => handleDelete(p._id)} className="text-red-600 p-2"><Trash2 size={16} /></button></div></td></tr>))}</tbody></table></div>
            </div>
        );
    };

    const OrdersList = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200"><div className="p-5 border-b border-gray-100"><h2 className="text-lg font-bold">Orders</h2></div><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-gray-50 text-gray-600"><tr><th className="px-6 py-3 text-xs font-bold">Order ID</th><th className="px-6 py-3 text-xs font-bold">Total</th><th className="px-6 py-3 text-xs font-bold">Status</th><th className="px-6 py-3 text-xs font-bold">Action</th></tr></thead><tbody className="divide-y divide-gray-100">{orders.map(o => (<tr key={o._id}><td className="px-6 py-4 text-sm text-indigo-600">#{o._id.substring(0, 8)}</td><td className="px-6 py-4 text-sm">Rs. {o.totalAmount}</td><td className="px-6 py-4 text-sm capitalize">{o.status}</td><td className="px-6 py-4"><select className="text-xs border rounded p-1" value={o.status} onChange={(e) => handleStatusUpdate(o._id, e.target.value)}><option value="pending">Pending</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option></select></td></tr>))}</tbody></table></div></div>
    );

    const Overview = () => (
        <div className="space-y-8"><h2 className="text-2xl font-bold text-gray-800">Overview</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="bg-[#1c2434] p-6 rounded-xl text-white"><p className="text-gray-400 text-sm">Products</p><h3 className="text-2xl font-bold">{products.length}</h3></div><div className="bg-[#1c2434] p-6 rounded-xl text-white"><p className="text-gray-400 text-sm">Orders</p><h3 className="text-2xl font-bold">{orders.length}</h3></div></div><ProductsList limit={5} title="Recent Uploads" /></div>
    );

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