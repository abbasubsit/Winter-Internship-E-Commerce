import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { getUserCart } from "../services/cartService";
import { setCredentials } from "../redux/authSlice";
import { setCart } from "../redux/cartSlice";

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
            const data = await loginUser({ email, password });

            // 2. Save User Info
            dispatch(setCredentials({ ...data }));

            // 3. Fetch user's cart from DB
            try {
                const cartData = await getUserCart(data.token);
                if (cartData && cartData.length > 0) {
                    dispatch(setCart(cartData));
                }
            } catch (cartError) {
                console.log("Cart fetch failed (New user maybe):", cartError);
            }

            if (data.role === 'admin') {
                navigate("/admin/dashboard");
            } else if (data.role === 'seller') {
                navigate("/seller/dashboard");
            } else {
                navigate("/");
            }

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
                    <div className="text-right mb-4">
                        <Link to="/forgot-password" className="text-blue-600 hover:underline text-sm">
                            Forgot Password?
                        </Link>
                    </div>
                    <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition font-bold">Login</button>
                </form>

                <p className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline font-semibold">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;