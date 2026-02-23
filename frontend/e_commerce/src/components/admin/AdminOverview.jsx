const AdminOverview = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats.users}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm">Total Sellers</p>
                <h3 className="text-3xl font-bold text-indigo-600">{stats.sellers}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm">Total Products</p>
                <h3 className="text-3xl font-bold text-green-600">{stats.products}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm">Total Orders</p>
                <h3 className="text-3xl font-bold text-orange-600">{stats.orders}</h3>
            </div>
        </div>
    );
};

export default AdminOverview;
