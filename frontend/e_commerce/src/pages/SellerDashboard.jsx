import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader } from "lucide-react";
import { BASE_URL } from "../services/api";
import { getMyProducts, deleteProduct } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import { getSellerOrders, updateOrderStatus } from "../services/orderService";

// Extracted Components
import SellerSidebar from "../components/seller/SellerSidebar";
import SellerProductForm from "../components/seller/SellerProductForm";
import SellerProductsList from "../components/seller/SellerProductsList";
import SellerOrdersList from "../components/seller/SellerOrdersList";
import SellerOverview from "../components/seller/SellerOverview";

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

    // Image Helper (shared across components)
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/150";
        if (imagePath.startsWith("http")) return imagePath;
        return `${BASE_URL}${imagePath}`;
    };

    // 1. Sync URL with Active Tab
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tabParam = params.get("tab");

        if (tabParam) {
            setActiveTab(tabParam);
        } else if (location.pathname.includes("/seller/products")) {
            setActiveTab("products");
        } else if (location.pathname.includes("/seller/orders")) {
            setActiveTab("orders");
        } else {
            setActiveTab("overview");
        }
    }, [location]);

    // 2. Auth Check
    useEffect(() => {
        if (!userInfo || userInfo.role !== 'seller') {
            navigate('/login');
        } else if (!userInfo.isVerified) {
            // Stay on page but show pending message
        } else {
            const fetchProducts = async () => {
                try {
                    const data = await getMyProducts(userInfo.token);
                    setProducts(data);
                } catch (error) {
                    console.error("Error fetching products", error);
                }
            };
            fetchProducts();
        }
    }, [userInfo, navigate]);

    // Block access if not verified
    if (userInfo && !userInfo.isVerified) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                    <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Approval Pending</h2>
                    <p className="text-gray-600 mb-6">
                        Thanks for registering! Your seller account is currently under review by our admin team.
                        You will have full access to the dashboard once approved.
                    </p>
                    <button onClick={() => navigate('/')} className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition">
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    // 3. Data Fetching
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Categories
                const catData = await getAllCategories();
                setCategories(catData);

                // Fetch Orders
                try {
                    const orderData = await getSellerOrders(userInfo.token);
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
                await deleteProduct(id, userInfo.token);
                setRefresh(!refresh);
            } catch (error) {
                alert("Delete Failed");
            }
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus, userInfo.token);
            const updatedOrders = orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            );
            setOrders(updatedOrders);
            alert(`Order marked as ${newStatus}`);
        } catch (error) {
            alert("Status Update Failed");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <SellerSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setEditingProduct={setEditingProduct}
            />
            <div className="flex-1 md:ml-64 p-8">
                {loading ? <div className="flex justify-center mt-20"><Loader className="animate-spin text-indigo-600" size={40} /></div> : (
                    <>
                        {activeTab === "overview" && (
                            <SellerOverview
                                products={products}
                                orders={orders}
                                setEditingProduct={setEditingProduct}
                                setActiveTab={setActiveTab}
                                handleDelete={handleDelete}
                                getImageUrl={getImageUrl}
                            />
                        )}
                        {activeTab === "products" && (
                            <SellerProductsList
                                products={products}
                                setEditingProduct={setEditingProduct}
                                setActiveTab={setActiveTab}
                                handleDelete={handleDelete}
                                getImageUrl={getImageUrl}
                            />
                        )}
                        {activeTab === "orders" && (
                            <SellerOrdersList
                                orders={orders}
                                handleStatusUpdate={handleStatusUpdate}
                            />
                        )}
                        {(activeTab === "add_product" || activeTab === "edit_product") && (
                            <SellerProductForm
                                userInfo={userInfo}
                                editingProduct={editingProduct}
                                setActiveTab={setActiveTab}
                                setRefresh={setRefresh}
                                refresh={refresh}
                                categories={categories}
                                getImageUrl={getImageUrl}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;