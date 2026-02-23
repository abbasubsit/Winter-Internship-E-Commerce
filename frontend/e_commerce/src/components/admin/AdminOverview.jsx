import { useMemo } from "react";
import {
    DollarSign, Users, ShoppingBag, Package, TrendingUp,
    ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, Truck
} from "lucide-react";

const AdminOverview = ({ stats, orders = [], users = [], products = [] }) => {

    // --- COMPUTED ANALYTICS ---
    const analytics = useMemo(() => {
        // Revenue
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        // Order status breakdown
        const statusCounts = { Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
        orders.forEach(o => {
            const s = o.status || "Processing";
            if (statusCounts[s] !== undefined) statusCounts[s]++;
        });

        // Revenue by month (last 6 months)
        const monthlyRevenue = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = d.toLocaleString("default", { month: "short" });
            monthlyRevenue[key] = 0;
        }
        orders.forEach(o => {
            const d = new Date(o.createdAt);
            const key = d.toLocaleString("default", { month: "short" });
            if (monthlyRevenue[key] !== undefined) {
                monthlyRevenue[key] += (o.totalPrice || 0);
            }
        });

        // Recent orders (last 5)
        const recentOrders = [...orders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        // Top products by category
        const categoryBreakdown = {};
        products.forEach(p => {
            const catName = p.category?.name || "Uncategorized";
            categoryBreakdown[catName] = (categoryBreakdown[catName] || 0) + 1;
        });

        // New users this month
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newUsersThisMonth = users.filter(u => new Date(u.createdAt) >= thisMonth).length;

        return { totalRevenue, statusCounts, monthlyRevenue, recentOrders, categoryBreakdown, newUsersThisMonth };
    }, [orders, users, products]);

    const maxMonthlyRevenue = Math.max(...Object.values(analytics.monthlyRevenue), 1);

    const statusConfig = {
        Processing: { color: "bg-yellow-500", icon: Clock, textColor: "text-yellow-600" },
        Shipped: { color: "bg-blue-500", icon: Truck, textColor: "text-blue-600" },
        Delivered: { color: "bg-green-500", icon: CheckCircle, textColor: "text-green-600" },
        Cancelled: { color: "bg-red-500", icon: XCircle, textColor: "text-red-600" },
    };

    return (
        <div className="space-y-6">

            {/* === STAT CARDS === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Total Revenue"
                    value={`$${analytics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                    icon={DollarSign}
                    color="bg-emerald-500"
                    subtitle={`${orders.length} orders`}
                />
                <StatCard
                    title="Total Users"
                    value={stats.users + stats.sellers}
                    icon={Users}
                    color="bg-blue-500"
                    subtitle={`+${analytics.newUsersThisMonth} this month`}
                />
                <StatCard
                    title="Total Products"
                    value={stats.products}
                    icon={ShoppingBag}
                    color="bg-purple-500"
                    subtitle={`${Object.keys(analytics.categoryBreakdown).length} categories`}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.orders}
                    icon={Package}
                    color="bg-orange-500"
                    subtitle={`${analytics.statusCounts.Processing} pending`}
                />
            </div>

            {/* === CHARTS ROW === */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Revenue Chart (Bar) */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-gray-800">Revenue Overview</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
                            <TrendingUp className="w-4 h-4" />
                            ${analytics.totalRevenue.toLocaleString()}
                        </div>
                    </div>
                    <div className="flex items-end gap-3 h-48">
                        {Object.entries(analytics.monthlyRevenue).map(([month, revenue]) => {
                            const height = maxMonthlyRevenue > 0 ? (revenue / maxMonthlyRevenue) * 100 : 0;
                            return (
                                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-xs text-gray-500 font-medium">
                                        ${revenue >= 1000 ? `${(revenue / 1000).toFixed(1)}k` : revenue.toFixed(0)}
                                    </span>
                                    <div className="w-full relative group">
                                        <div
                                            className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500 hover:from-emerald-600 hover:to-emerald-500"
                                            style={{ height: `${Math.max(height, 4)}%`, minHeight: "8px" }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-400">{month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Order Status Breakdown */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-5">Order Status</h3>
                    <div className="space-y-4">
                        {Object.entries(analytics.statusCounts).map(([status, count]) => {
                            const config = statusConfig[status];
                            const Icon = config.icon;
                            const pct = orders.length > 0 ? ((count / orders.length) * 100).toFixed(0) : 0;
                            return (
                                <div key={status}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <Icon className={`w-4 h-4 ${config.textColor}`} />
                                            <span className="text-sm text-gray-700">{status}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800">{count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`${config.color} rounded-full h-2 transition-all duration-700`}
                                            style={{ width: `${pct}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* === BOTTOM ROW === */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Recent Orders</h3>
                    {analytics.recentOrders.length === 0 ? (
                        <p className="text-gray-400 text-sm">No orders yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-400 text-xs uppercase">
                                        <th className="pb-3 font-medium">Order ID</th>
                                        <th className="pb-3 font-medium">Customer</th>
                                        <th className="pb-3 font-medium">Amount</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {analytics.recentOrders.map(order => {
                                        const statusKey = order.status || "Processing";
                                        const config = statusConfig[statusKey] || { color: "bg-gray-500", textColor: "text-gray-600" };
                                        return (
                                            <tr key={order._id} className="hover:bg-gray-50 transition">
                                                <td className="py-3 font-mono text-xs text-gray-500">#{order._id?.slice(-6)}</td>
                                                <td className="py-3 text-gray-700">{order.user?.name || order.shippingAddress?.fullName || "—"}</td>
                                                <td className="py-3 font-semibold text-gray-800">${order.totalPrice?.toFixed(2)}</td>
                                                <td className="py-3">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color} bg-opacity-10 ${config.textColor}`}>
                                                        {order.status || "Processing"}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Category Breakdown */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Products by Category</h3>
                    <div className="space-y-3">
                        {Object.entries(analytics.categoryBreakdown)
                            .sort((a, b) => b[1] - a[1])
                            .map(([cat, count]) => {
                                const pct = products.length > 0 ? ((count / products.length) * 100).toFixed(0) : 0;
                                return (
                                    <div key={cat}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700">{cat}</span>
                                            <span className="text-gray-500">{count} ({pct}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="bg-purple-500 rounded-full h-2 transition-all duration-700"
                                                style={{ width: `${pct}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- STAT CARD COMPONENT ---
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
        <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-0.5">{value}</h3>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
    </div>
);

export default AdminOverview;
