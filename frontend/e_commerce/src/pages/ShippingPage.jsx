import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../redux/cartSlice";

const ShippingPage = () => {
    const { shippingAddress } = useSelector((state) => state.cart);

    const [address, setAddress] = useState(shippingAddress?.address || "");
    const [city, setCity] = useState(shippingAddress?.city || "");
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
    const [country, setCountry] = useState(shippingAddress?.country || "");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();

        // 1. Save data to Redux & LocalStorage
        dispatch(saveShippingAddress({ address, city, postalCode, country }));

        // 2. Move to next step (Payment or Place Order)
        navigate("/payment");
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Shipping Address</h1>

            <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-md border">

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Address</label>
                    <input
                        type="text"
                        placeholder="123 Main St"
                        className="w-full p-2 border rounded"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">City</label>
                    <input
                        type="text"
                        placeholder="Lahore"
                        className="w-full p-2 border rounded"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Postal Code</label>
                    <input
                        type="text"
                        placeholder="54000"
                        className="w-full p-2 border rounded"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Country</label>
                    <input
                        type="text"
                        placeholder="Pakistan"
                        className="w-full p-2 border rounded"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="w-full bg-[#111111] text-white py-3 rounded font-bold hover:bg-gray-800 transition">
                    Continue
                </button>

            </form>
        </div>
    );
};

export default ShippingPage;