import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // API call ke liye
import { setCredentials } from "../redux/authSlice"; // Data save karne ke liye

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            // 1. Backend ko call karo
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            });

            // 2. Agar success hua, toh data Redux mein save karo
            dispatch(setCredentials({ ...res.data }));

            // 3. Homepage par bhej do
            navigate("/");

        } catch (err) {
            // Agar password galat hai
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
                        <input
                            type="email"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition font-bold"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;