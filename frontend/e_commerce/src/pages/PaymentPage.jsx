import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../redux/cartSlice";

const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState("PayPal");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { shippingAddress } = useSelector((state) => state.cart);

    // Agar shipping address nahi hai, toh wapis bhejo
    if (!shippingAddress) {
        navigate("/shipping");
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate("/placeorder");
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-[#111111]">Payment Method</h1>

            <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-[#111111]">Select Method</h2>

                <div className="mb-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="radio"
                            className="form-radio h-5 w-5 text-black"
                            value="PayPal"
                            checked={paymentMethod === "PayPal"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="text-gray-700 font-medium">PayPal or Credit Card</span>
                    </label>
                </div>

                <div className="mb-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="radio"
                            className="form-radio h-5 w-5 text-black"
                            value="Stripe"
                            checked={paymentMethod === "Stripe"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="text-gray-700 font-medium">Stripe</span>
                    </label>
                </div>

                <div className="mb-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="radio"
                            className="form-radio h-5 w-5 text-black"
                            value="COD"
                            checked={paymentMethod === "COD"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="text-gray-700 font-medium">Cash on Delivery</span>
                    </label>
                </div>

                <button type="submit" className="w-full bg-[#111111] text-white py-3 rounded font-bold hover:bg-gray-800 transition">
                    Continue
                </button>
            </form>
        </div>
    );
};

export default PaymentPage;