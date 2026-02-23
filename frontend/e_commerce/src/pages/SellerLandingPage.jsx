import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../services/authService';
import { setCredentials } from '../redux/authSlice';
// import sellerHero from '../assets/seller_hero.png';
import { CheckCircle, User, Mail, CreditCard, Upload } from 'lucide-react';

const SellerLandingPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const data = await registerUser({ name, email, password, role: "seller" });
            dispatch(setCredentials({ ...data }));
            navigate("/seller/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Registration Failed");
        }
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* 1. HERO SECTION */}
            <div className="relative w-full md:h-[650px] bg-cyan-400 overflow-hidden flex items-center">
                {/* Background Color/Gradient matching the user image */}
                <div className="absolute inset-0 bg-[#4FDACE]"></div>

                <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between h-full py-12 md:py-0">

                    {/* Left: Text Content */}
                    <div className="md:w-1/2 text-left space-y-6">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-[#111111] leading-tight tracking-tight drop-shadow-sm">
                            GROW YOUR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700" style={{ WebkitTextStroke: '1px black', color: 'transparent' }}>BUSINESS</span> <br />
                            WITH US
                        </h1>
                        <p className="text-lg text-gray-800 font-medium">Join thousands of successful sellers on our platform today.</p>
                    </div>

                    {/* Right: Registration Form & Image */}
                    <div className="md:w-1/2 h-full flex items-center justify-center md:justify-end relative">
                        {/* FORM CONTAINER (Overlay on Right) */}
                        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md z-20 relative">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Become a Seller</h2>

                            {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">{error}</div>}

                            <form onSubmit={submitHandler} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-1">Store/Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. My Awesome Store"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="********"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition transform active:scale-95 shadow-lg">
                                    Register Now
                                </button>
                            </form>
                            <p className="text-center text-xs text-gray-500 mt-4">By signing up, you agree to our Terms & Conditions.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. STEPS TO START SELLING */}
            <div className="py-24 bg-[#FFF5F0]"> {/* Light peach/cream bg from image */}
                <div className="container mx-auto px-6 max-w-6xl">
                    <h2 className="text-4xl md:text-5xl font-bold text-center text-[#2D3748] mb-20 tracking-wide">
                        Steps to Start Selling
                    </h2>

                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        {/* Left: Description & CTA */}
                        <div className="space-y-8">
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Sign up now to be a SMV-ECOM Seller! SMV-ECOM offers good opportunity and support for you to dive into the market and grow your customer base with ease. As a SMV-ECOM Seller, you will get access to various resources to help you drive your business on our platform.
                            </p>
                        </div>

                        {/* Right: Accordion/Steps List */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
                            {/* Step 1 */}
                            <div className="border-b last:border-0 border-gray-100">
                                <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-xl text-gray-800">1. Sign up with a phone number</span>
                                    </div>
                                    <User className="text-gray-400" />
                                </div>
                            </div>
                            {/* Step 2 */}
                            <div className="border-b last:border-0 border-gray-100">
                                <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-xl text-gray-800">2. Fill in contact email & address details</span>
                                    </div>
                                    <Mail className="text-gray-400" />
                                </div>
                            </div>
                            {/* Step 3 */}
                            <div className="border-b last:border-0 border-gray-100">
                                <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-xl text-gray-800">3. Submit ID and Bank Account details</span>
                                    </div>
                                    <CreditCard className="text-gray-400" />
                                </div>
                            </div>
                            {/* Step 4 */}
                            <div className="border-b last:border-0 border-gray-100">
                                <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-xl text-gray-800">4. Upload products and get orders!</span>
                                    </div>
                                    <Upload className="text-gray-400" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerLandingPage;
