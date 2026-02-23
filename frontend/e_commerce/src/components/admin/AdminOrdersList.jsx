const AdminOrdersList = ({ orders }) => {
    return (
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
};

export default AdminOrdersList;
