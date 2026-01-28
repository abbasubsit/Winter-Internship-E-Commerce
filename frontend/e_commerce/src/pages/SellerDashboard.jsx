import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
    const [categories, setCategories] = useState([]);

    // Form States
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null); // File object
    const [uploading, setUploading] = useState(false);

    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // 1. Check if user is seller
    useEffect(() => {
        if (!userInfo || userInfo.role !== "seller") {
            navigate("/"); // Agar seller nahi hai to bhaga do
        }
    }, [userInfo, navigate]);

    // 2. Fetch Categories for Dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await axios.get("http://localhost:5000/api/categories");
            setCategories(data);
        };
        fetchCategories();
    }, []);

    // 3. Handle File Upload (Image)
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        setUploading(true);

        try {
            const config = {
                headers: { "Content-Type": "multipart/form-data" },
            };
            const { data } = await axios.post("http://localhost:5000/api/upload", formData, config);
            setImage(data.image); // Path save kar liya
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert("Image Upload Failed");
        }
    };

    // 4. Handle Form Submit (Create Product)
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!category) {
            alert("Please select a category");
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };

            await axios.post(
                "http://localhost:5000/api/products",
                {
                    title,
                    description,
                    price,
                    stock,
                    category,
                    images: [image], // Array mein path bhejo
                },
                config
            );

            alert("Product Created Successfully!");
            navigate("/"); // Home page pe wapis
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto border">
                <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Product Name</label>
                        <input type="text" className="w-full p-2 border rounded" required
                            value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Price ($)</label>
                        <input type="number" className="w-full p-2 border rounded" required
                            value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Stock Quantity</label>
                        <input type="number" className="w-full p-2 border rounded" required
                            value={stock} onChange={(e) => setStock(e.target.value)} />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Category</label>
                        <select className="w-full p-2 border rounded" required
                            value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <textarea className="w-full p-2 border rounded h-24" required
                            value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Product Image</label>
                        <input type="file" className="w-full p-2 border rounded"
                            onChange={uploadFileHandler} />
                        {uploading && <p className="text-blue-500 text-sm">Uploading...</p>}
                        {image && <p className="text-green-500 text-sm mt-1">Image Uploaded!</p>}
                    </div>

                    <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-700 font-bold transition">
                        Create Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SellerDashboard;