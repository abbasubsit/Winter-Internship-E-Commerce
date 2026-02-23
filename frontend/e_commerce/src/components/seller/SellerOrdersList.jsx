const SellerOrdersList = ({ orders, handleStatusUpdate }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold">Orders</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold">Order ID</th>
                            <th className="px-6 py-3 text-xs font-bold">Total</th>
                            <th className="px-6 py-3 text-xs font-bold">Status</th>
                            <th className="px-6 py-3 text-xs font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map(o => (
                            <tr key={o._id}>
                                <td className="px-6 py-4 text-sm text-indigo-600">#{o._id.substring(0, 8)}</td>
                                <td className="px-6 py-4 text-sm">Rs. {o.totalAmount}</td>
                                <td className="px-6 py-4 text-sm capitalize">{o.status}</td>
                                <td className="px-6 py-4">
                                    <select className="text-xs border rounded p-1" value={o.status} onChange={(e) => handleStatusUpdate(o._id, e.target.value)}>
                                        <option value="pending">Pending</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerOrdersList;
