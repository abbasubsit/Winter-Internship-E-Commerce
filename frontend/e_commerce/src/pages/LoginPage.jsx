import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setCredentials } from "../redux/authSlice";
import { setCart } from "../redux/cartSlice"; // ✅ Import

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            // 1. Login API Call
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            });

            // 2. Save User Info
            dispatch(setCredentials({ ...res.data }));

            // 3. ✅ FETCH USER'S CART FROM DB
            try {
                const config = {
                    headers: { Authorization: `Bearer ${res.data.token}` }
                };
                const { data: cartData } = await axios.get("http://localhost:5000/api/users/cart", config);

                // Agar DB mein cart hai, to Redux update karo
                if (cartData && cartData.length > 0) {
                    dispatch(setCart(cartData));
                }
            } catch (cartError) {
                console.log("Cart fetch failed (New user maybe):", cartError);
            }

            navigate("/");

        } catch (err) {
            setError(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
                {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email Address</label>
                        <input type="email" className="w-full p-2 border rounded" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input type="password" className="w-full p-2 border rounded" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition font-bold">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;