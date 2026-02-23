import {
    LayoutDashboard, Users, ShoppingBag, Package, LogOut
} from "lucide-react";

const AdminSidebar = ({ activeTab, setActiveTab, handleLogout }) => {
    return (
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
};

export default AdminSidebar;
