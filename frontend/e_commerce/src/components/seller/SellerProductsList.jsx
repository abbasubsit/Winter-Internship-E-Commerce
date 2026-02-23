import { Plus, Edit3, Trash2 } from "lucide-react";

const SellerProductsList = ({ products, limit, title, setEditingProduct, setActiveTab, handleDelete, getImageUrl }) => {
    const displayProducts = limit ? products.slice(0, limit) : products;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-lg">
                <h2 className="text-lg font-bold text-gray-800">{title || "My Products"}</h2>
                {!limit && (
                    <button onClick={() => { setEditingProduct(null); setActiveTab("add_product"); }} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center">
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
                        {displayProducts.map(p => (
                            <tr key={p._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <img src={getImageUrl(p.images?.[0])} className="w-10 h-10 rounded border" alt="" />
                                    <span className="text-sm font-medium">{p.title}</span>
                                </td>
                                <td className="px-6 py-4 text-sm">Rs. {p.price}</td>
                                <td className="px-6 py-4 text-sm">{p.stock}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{p.category?.name || "General"}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => { setEditingProduct(p); setActiveTab("edit_product"); }} className="text-blue-600 p-2"><Edit3 size={16} /></button>
                                        <button onClick={() => handleDelete(p._id)} className="text-red-600 p-2"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerProductsList;
