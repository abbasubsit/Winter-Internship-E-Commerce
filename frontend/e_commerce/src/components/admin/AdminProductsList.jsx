import { Trash2 } from "lucide-react";

const AdminProductsList = ({ products, categories, selectedCategory, setSelectedCategory, handleDeleteProduct, getImageUrl }) => {
    const filteredProducts = selectedCategory
        ? products.filter(p => (p.category?._id || p.category) === selectedCategory)
        : products;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Product Header with Filter */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="font-bold text-gray-700">All Products ({filteredProducts.length})</h2>
                <select
                    className="p-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <table className="w-full text-left">
                <thead className="bg-white text-gray-600 border-b">
                    <tr><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Category</th><th className="p-4">Action</th></tr>
                </thead>
                <tbody className="divide-y">
                    {filteredProducts.map(p => (
                        <tr key={p._id} className="hover:bg-gray-50">
                            <td className="p-4 flex items-center gap-3">
                                <img src={getImageUrl(p.images?.[0])} className="w-10 h-10 rounded border object-cover" alt="" />
                                <span className="font-medium text-sm max-w-[200px] truncate">{p.title}</span>
                            </td>
                            <td className="p-4 text-sm">Rs. {p.price}</td>
                            <td className="p-4 text-sm">{p.stock}</td>
                            <td className="p-4 text-sm text-gray-500">{p.category?.name || "General"}</td>
                            <td className="p-4"><button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><Trash2 size={18} /></button></td>
                        </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">No products found for this category.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProductsList;
