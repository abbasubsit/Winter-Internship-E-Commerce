import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader } from "lucide-react";
import { logout } from "../redux/authSlice";

// Extracted Components
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminOverview from "../components/admin/AdminOverview";
import AdminUsersList from "../components/admin/AdminUsersList";
import AdminOrdersList from "../components/admin/AdminOrdersList";
import AdminProductsList from "../components/admin/AdminProductsList";

const BASE_URL = "http://localhost:5000";

const AdminDashboard = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("overview");

    // Sync URL query params with Active Tab
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
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [selectedCategory, setSelectedCategory] = useState("");

    // Image Helper (shared across components)
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/150";
        if (imagePath.startsWith("http")) return imagePath;
        return `${BASE_URL}${imagePath}`;
    };

    useEffect(() => {
        if (!userInfo || userInfo.role !== "admin") {
            navigate("/");
        } else {
            fetchData();
        }
    }, [userInfo, navigate]);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            setLoading(true);

            const { data: usersData } = await axios.get(`${BASE_URL}/api/admin/users`, config);
            setUsers(usersData);

            const { data: ordersData } = await axios.get(`${BASE_URL}/api/admin/orders`, config);
            setOrders(ordersData);

            const { data: productsData } = await axios.get(`${BASE_URL}/api/products`);
            setProducts(productsData);

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

    // --- HANDLERS ---
    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure? This will delete the user and their data.")) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`${BASE_URL}/api/admin/users/${id}`, config);
                fetchData();
            } catch (error) {
                alert("Failed to delete user");
            }
        }
    };

    const handleVerifySeller = async (id, name) => {
        if (window.confirm(`Approve ${name} as a Seller?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.put(`${BASE_URL}/api/admin/users/${id}/verify`, {}, config);
                fetchData();
            } catch (error) {
                alert("Failed to verify seller");
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
        navigate("/");
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
            />
            <div className="flex-1 md:ml-64 p-8">
                {loading ? <div className="flex justify-center mt-20"><Loader className="animate-spin text-gray-700" /></div> : (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-gray-800 capitalize">{activeTab.replace('_', ' ')}</h1>
                        {activeTab === 'overview' && <AdminOverview stats={stats} />}
                        {activeTab === 'users' && (
                            <AdminUsersList
                                users={users}
                                userInfo={userInfo}
                                handleDeleteUser={handleDeleteUser}
                                handleVerifySeller={handleVerifySeller}
                            />
                        )}
                        {activeTab === 'orders' && <AdminOrdersList orders={orders} />}
                        {activeTab === 'products' && (
                            <AdminProductsList
                                products={products}
                                categories={categories}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                handleDeleteProduct={handleDeleteProduct}
                                getImageUrl={getImageUrl}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
