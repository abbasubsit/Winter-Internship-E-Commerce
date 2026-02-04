import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Store, ChevronDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
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

    // Total Items Count
    const totalItems = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

    const logoutHandler = () => {
        dispatch(logout());
        dispatch(clearCart());
        setIsDropdownOpen(false);
        navigate("/login");
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
        <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center">

                {/* 1. Logo */}
                <Link to="/" className="text-2xl font-bold text-yellow-400 flex-shrink-0">
                    SMV-ECOM
                </Link>

                {/* 2. Navigation Links (Moved next to Logo with spacing) */}
                <div className="hidden md:flex items-center space-x-6 ml-10">
                    <Link to="/" className="hover:text-yellow-400 transition font-medium text-sm">Home</Link>
                    <Link to="/menProducts" className="hover:text-yellow-400 transition font-medium text-sm">Men</Link>
                    <Link to="/womenProducts" className="hover:text-yellow-400 transition font-medium text-sm">Women</Link>
                    <Link to="/electronicProducts" className="hover:text-yellow-400 transition font-medium text-sm">Electronics</Link>
                    <Link to="/trendingProducts" className="hover:text-yellow-400 transition font-medium text-sm">Trending</Link>
                </div>

                {/* 3. Right Side Icons (Pushed to end) */}
                <div className="flex items-center space-x-6 ml-auto">

                    {/* Seller Button (Only if NOT logged in) */}
                    {!userInfo && (
                        <Link
                            to="/seller-register" // Iska page baad mein bana lena
                            className="hidden md:flex items-center bg-gray-800 border border-gray-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-700 transition"
                        >
                            <Store size={14} className="mr-1.5 text-yellow-400" /> Become a Seller
                        </Link>
                    )}

                    {/* Cart Icon */}
                    <Link to="/cart" className="relative hover:text-yellow-400 transition">
                        <ShoppingCart size={24} />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Profile Dropdown Icon */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center hover:text-yellow-400 transition focus:outline-none"
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