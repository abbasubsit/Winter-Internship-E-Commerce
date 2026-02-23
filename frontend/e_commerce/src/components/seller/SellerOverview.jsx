import SellerProductsList from "./SellerProductsList";

const SellerOverview = ({ products, orders, setEditingProduct, setActiveTab, handleDelete, getImageUrl }) => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1c2434] p-6 rounded-xl text-white">
                    <p className="text-gray-400 text-sm">Products</p>
                    <h3 className="text-2xl font-bold">{products.length}</h3>
                </div>
                <div className="bg-[#1c2434] p-6 rounded-xl text-white">
                    <p className="text-gray-400 text-sm">Orders</p>
                    <h3 className="text-2xl font-bold">{orders.length}</h3>
                </div>
            </div>
            <SellerProductsList
                products={products}
                limit={5}
                title="Recent Uploads"
                setEditingProduct={setEditingProduct}
                setActiveTab={setActiveTab}
                handleDelete={handleDelete}
                getImageUrl={getImageUrl}
            />
        </div>
    );
};

export default SellerOverview;
