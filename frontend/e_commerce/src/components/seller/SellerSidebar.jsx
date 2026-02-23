import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard, Package, ShoppingBag, Plus, LogOut
} from "lucide-react";

const SellerSidebar = ({ activeTab, setActiveTab, setEditingProduct }) => {
    const navigate = useNavigate();

    return (
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
};

export default SellerSidebar;
