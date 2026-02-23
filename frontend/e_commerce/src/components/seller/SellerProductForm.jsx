import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { uploadImage } from "../../services/uploadService";
import { createProduct, updateProduct } from "../../services/productService";
import { BASE_URL } from "../../services/api";

const SellerProductForm = ({ userInfo, editingProduct, setActiveTab, setRefresh, refresh, categories, getImageUrl }) => {
    const [formData, setFormData] = useState({
        title: "", price: "", stock: "", category: "", description: "", image: "",
        brand: "", color: "", sizes: ""
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (editingProduct) {
            const sizesString = editingProduct.size ? editingProduct.size.map(s => s.name).join(", ") : "";
            setFormData({
                title: editingProduct.title || "",
                price: editingProduct.price || "",
                stock: editingProduct.stock || "",
                category: editingProduct.category?._id || editingProduct.category || "",
                description: editingProduct.description || "",
                image: editingProduct.images?.[0] || "",
                brand: editingProduct.brand || "",
                color: editingProduct.color || "",
                sizes: sizesString
            });
        } else {
            setFormData({ title: "", price: "", stock: "", category: "", description: "", image: "", brand: "", color: "", sizes: "" });
        }
    }, [editingProduct]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const fd = new FormData();
        fd.append("image", file);
        setUploading(true);
        try {
            const data = await uploadImage(fd, userInfo.token);
            setFormData({ ...formData, image: data.image });
            setUploading(false);
        } catch (error) {
            setUploading(false);
            alert("Image Upload Failed");
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!formData.category) {
            alert("Please select a Category from the list!");
            return;
        }

        try {
            const payload = { ...formData, images: [formData.image] };

            if (editingProduct) {
                await updateProduct(editingProduct._id, payload, userInfo.token);
                alert("Product Updated Successfully");
            } else {
                await createProduct(payload, userInfo.token);
                alert("Product Created Successfully");
            }
            setRefresh(!refresh);
            setActiveTab("products");
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <button onClick={() => setActiveTab("products")} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 font-medium"><ArrowLeft size={18} className="mr-2" /> Back to Products</button>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                <form onSubmit={submitHandler} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-semibold mb-2">Product Name</label><input type="text" required className="w-full p-2.5 border rounded" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>

                        {/* Category Dropdown */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">Category <span className="text-red-500">*</span></label>
                            <select
                                required
                                className="w-full p-2.5 border rounded bg-white"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-semibold mb-2">Price (Rs.)</label><input type="number" required className="w-full p-2.5 border rounded" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></div>
                        <div><label className="block text-sm font-semibold mb-2">Total Stock</label><input type="number" required className="w-full p-2.5 border rounded" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} /></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-semibold mb-2">Brand</label><input type="text" className="w-full p-2.5 border rounded" placeholder="e.g. Nike" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} /></div>
                        <div><label className="block text-sm font-semibold mb-2">Color</label><input type="text" className="w-full p-2.5 border rounded" placeholder="e.g. Red" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} /></div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Sizes (Comma separated)</label>
                        <input type="text" className="w-full p-2.5 border rounded" placeholder="S, M, L, XL" value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} />
                        <p className="text-xs text-gray-500 mt-1">For Electronics, leave empty.</p>
                    </div>

                    <div><label className="block text-sm font-semibold mb-2">Description</label><textarea required rows="4" className="w-full p-2.5 border rounded" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea></div>
                    <div><label className="block text-sm font-semibold mb-2">Image</label><input type="file" onChange={uploadFileHandler} className="mb-2" />{uploading && <p className="text-xs text-blue-500 font-bold">Uploading...</p>}{formData.image && <img src={getImageUrl(formData.image)} alt="Preview" className="h-24 mt-2 rounded border" />}</div>
                    <div className="flex justify-end"><button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-md font-bold hover:bg-indigo-700 transition shadow-md">{editingProduct ? "Update" : "Publish"}</button></div>
                </form>
            </div>
        </div>
    );
};

export default SellerProductForm;
