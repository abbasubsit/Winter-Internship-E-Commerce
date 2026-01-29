import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";

const Navbar = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ✅ FIX: Total items count karne ka logic (e.g., 2 shirts + 1 pant = 3 items)
    const totalItems = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

    const logoutHandler = () => {
        dispatch(logout());
        dispatch(clearCart());
        navigate("/login");
    };

    return (
        <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-yellow-400">
                    SMV-ECOM
                </Link>

                {/* Links */}
                <div className="flex items-center space-x-6">
                    <Link to="/" className="hover:text-yellow-400 transition">
                        Home
                    </Link>
                    <Link to="/trendingProducts" className="hover:text-yellow-400 transition">
                        Trending
                    </Link>

                    <Link to="/cart" className="relative hover:text-yellow-400 transition">
                        <ShoppingCart size={24} />
                        {/* ✅ Badge ab Total Items dikhayega */}
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {userInfo ? (
                        <div className="flex items-center space-x-4">
                            {userInfo.role === 'seller' && (
                                <Link to="/seller/dashboard" className="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-500">
                                    Dashboard
                                </Link>
                            )}

                            <span className="text-yellow-400 font-medium hidden md:block">Hi, {userInfo.name}</span>
                            <button onClick={logoutHandler} className="flex items-center text-red-400 hover:text-red-300">
                                <LogOut size={20} className="mr-1" /> <span className="hidden md:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="flex items-center space-x-1 hover:text-yellow-400 transition">
                                <User size={24} /> <span className="hidden md:inline">Login</span>
                            </Link>
                            <Link to="/register" className="bg-yellow-400 text-gray-900 px-4 py-1 rounded hover:bg-yellow-300 transition font-medium hidden md:block">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;