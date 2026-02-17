import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Store, ChevronDown, Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios"; // Added for fetching pending count
import { logout } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";

const Navbar = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Dropdown State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Admin Notification Logic
    const [pendingSellers, setPendingSellers] = useState(0);

    // Total Items Count
    const totalItems = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

    useEffect(() => {
        if (userInfo && userInfo.role === 'admin') {
            const fetchPendingCount = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                    const { data } = await axios.get("http://localhost:5000/api/admin/users", config);
                    // Count users where role is seller AND isVerified is false
                    const count = data.filter(u => u.role === 'seller' && !u.isVerified).length;
                    setPendingSellers(count);
                } catch (error) {
                    console.error("Failed to fetch pending sellers", error);
                }
            };
            fetchPendingCount();
        }
    }, [userInfo]);

    const logoutHandler = () => {
        dispatch(logout());
        dispatch(clearCart());
        setIsDropdownOpen(false);
        navigate("/"); // ✅ Redirect to Home
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <nav className="bg-white text-gray-800 shadow-md relative z-50 transition-all duration-300">
            <div className="container mx-auto px-4 py-3 md:py-4 flex items-center">

                {/* 1. Logo */}
                <Link to="/" className="text-2xl font-extrabold text-[#111111] tracking-tight flex-shrink-0">
                    SMV-ECOM
                    {userInfo?.role === 'seller' && <span className="text-xs text-gray-400 ml-2 font-normal">(Seller Panel)</span>}
                </Link>

                {/* 2. Navigation Links (Yahan Changes kiye hain) */}
                <div className="hidden md:flex items-center space-x-8 ml-12">

                    {userInfo && userInfo.role === 'seller' ? (
                        // --- SELLER TABS (Agar Seller login hai) ---
                        <>
                            <Link to="/seller/dashboard" className="hover:text-black transition font-medium text-sm text-gray-600">Dashboard</Link>
                            <Link to="/seller/products" className="hover:text-black transition font-medium text-sm text-gray-600">My Products</Link>
                            <Link to="/seller/orders" className="hover:text-black transition font-medium text-sm text-gray-600">Orders</Link>
                            {/* Add Product ko thoda highlight kiya hai */}
                            <Link to="/seller/dashboard?tab=add_product" className="text-white bg-black px-4 py-2 rounded hover:bg-gray-800 transition font-bold text-sm">
                                + Add Product
                            </Link>
                        </>
                    ) : userInfo && userInfo.role === 'admin' ? (
                        // --- ADMIN TABS (Agar Admin login hai) ---
                        <>
                            <Link to="/admin/dashboard" className="hover:text-black transition font-medium text-sm text-gray-600">Admin Dashboard</Link>

                            {/* Notification Icon for Admin */}
                            <Link to="/admin/dashboard?tab=users" className="relative group">
                                <Bell size={20} className="text-gray-600 group-hover:text-black transition" />
                                {pendingSellers > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-5 w-5 bg-red-600 items-center justify-center rounded-full text-[10px] text-white font-bold border-2 border-white">
                                        {pendingSellers}
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    </span>
                                )}
                            </Link>
                        </>
                    ) : (
                        // --- CUSTOMER TABS (Purana Design) ---
                        <>
                            <Link to="/" className="hover:text-black transition font-medium text-sm text-gray-600">Home</Link>
                            <Link to="/menProducts" className="hover:text-black transition font-medium text-sm text-gray-600">Men</Link>
                            <Link to="/womenProducts" className="hover:text-black transition font-medium text-sm text-gray-600">Women</Link>
                            <Link to="/electronicProducts" className="hover:text-black transition font-medium text-sm text-gray-600">Electronics</Link>
                            <Link to="/trendingProducts" className="hover:text-black transition font-medium text-sm text-gray-600">Trending</Link>
                        </>
                    )}
                </div>

                {/* 3. Right Side Icons */}
                <div className="flex items-center space-x-6 ml-auto">

                    {/* Seller Button (Only if NOT logged in) */}
                    {!userInfo && (
                        <Link
                            to="/seller-register"
                            className="hidden md:flex items-center bg-yellow-400 border border-yellow-500 px-4 py-2 rounded-full text-xs font-extra-bold hover:bg-yellow-500 transition text-gray-900 shadow-md"
                        >
                            <Store size={16} className="mr-1.5 text-gray-900" /> BECOME A SELLER
                        </Link>
                    )}

                    {/* Cart Icon (Seller/Admin ko shayad cart ki zaroorat na ho) */}
                    {userInfo?.role !== 'seller' && userInfo?.role !== 'admin' && (
                        <Link to="/cart" className="relative hover:text-black transition text-gray-700">
                            <ShoppingCart size={24} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* Profile Dropdown Icon */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center hover:text-black transition focus:outline-none text-gray-700"
                        >
                            <User size={24} />
                        </button>

                        {/* Dropdown Window */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">

                                {userInfo ? (
                                    // LOGGED IN VIEW
                                    <>
                                        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                                            <p className="text-xs text-gray-500">Signed in as</p>
                                            <p className="text-sm font-bold truncate">{userInfo.name}</p>
                                        </div>

                                        {userInfo.role === 'admin' && (
                                            <Link
                                                to="/admin/dashboard"
                                                className="block px-4 py-2 text-sm hover:bg-gray-100 transition text-red-600 font-bold"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}

                                        {userInfo.role === 'seller' && (
                                            <Link
                                                to="/seller/dashboard"
                                                className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Seller Dashboard
                                            </Link>
                                        )}

                                        <Link
                                            to="/myorders"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            My Orders
                                        </Link>

                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            My Profile
                                        </Link>

                                        <button
                                            onClick={logoutHandler}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center"
                                        >
                                            <LogOut size={14} className="mr-2" /> Logout
                                        </button>
                                    </>
                                ) : (
                                    // LOGGED OUT VIEW
                                    <>
                                        <Link
                                            to="/login"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 transition font-medium"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Sign Up
                                        </Link>
                                        <div className="border-t border-gray-100 mt-1"></div>
                                        <Link
                                            to="/seller-register"
                                            className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 transition"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Seller Account
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;