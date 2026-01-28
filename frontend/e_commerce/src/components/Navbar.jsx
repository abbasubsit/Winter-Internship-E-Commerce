import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux"; // <--- Import hooks
import { logout } from "../redux/authSlice"; // <--- Import logout action

const Navbar = () => {
    const { userInfo } = useSelector((state) => state.auth); // Redux se user nikalo
    const { cartItems } = useSelector((state)=> state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <nav className="bg-gray-900 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-yellow-400">E.Shop</Link>

                <div className="flex items-center space-x-6">
                    <Link to="/" className="hover:text-yellow-400 transition">Home</Link>

                    <Link to="/mencatagories" className="hover:text-yellow-400 transition">Men</Link>

                    <Link to="/womencatagories" className="hover:text-yellow-400 transition">Women</Link>

                    <Link to="/accessories" className="hover:text-yellow-400 transition">Accessories</Link>

                    <Link to="/Electronics" className="hover:text-yellow-400 transition">Electronics</Link>
                    </div>

                <div className="flex items-center space-x-6">

                    <Link to="/cart" className="relative hover:text-yellow-400 transition">
                        <ShoppingCart size={24} />

                        {/* Logic: Agar items hain tabhi badge dikhao */}
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                                {cartItems.length}
                            </span>
                        )}

                        
                    </Link>

                    {/* DYNAMIC PART SHURU */}
                    {userInfo ? (
                        <div className="flex items-center space-x-4">
                            {/* Sirf Seller ke liye Dashboard Link */}
                            {userInfo.role === 'seller' && (
                                <Link to="/seller/dashboard" className="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-500">
                                    Seller Dashboard
                                </Link>
                            )}
                            <span className="text-yellow-400 font-medium">{userInfo.name}</span>
                            <button onClick={logoutHandler} className="flex items-center text-red-400 hover:text-red-300">
                                <LogOut size={20} className="mr-1" /> Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="flex items-center space-x-1 hover:text-yellow-400 transition">
                                <User size={24} /> <span>Login</span>
                            </Link>
                            <Link to="/register" className="bg-yellow-400 text-gray-900 px-4 py-1 rounded hover:bg-yellow-300 transition font-medium">
                                Register
                            </Link>
                        </>
                    )}
                    {/* DYNAMIC PART KHATAM */}

                </div>
            </div>
        </nav>
    );
};

export default Navbar;




// import { Link } from "react-router-dom";
// import { ShoppingCart, User } from "lucide-react"; // Icons

// const Navbar = () => {
//     return (
//         <nav className="bg-gray-900 text-white shadow-md">
//             <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//                 {/* Logo */}
//                 <Link to="/" className="text-2xl font-bold text-yellow-400">
//                     SMV-ECOM
//                 </Link>

//                 {/* Links */}
//                 <div className="flex items-center space-x-6">
//                     <Link to="/" className="hover:text-yellow-400 transition">
//                         Home
//                     </Link>

//                     <Link to="/cart" className="relative hover:text-yellow-400 transition">
//                         <ShoppingCart size={24} />
//                         {/* Cart Badge (Dummy for now) */}
//                         <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
//                             0
//                         </span>
//                     </Link>

//                     <Link to="/login" className="flex items-center space-x-1 hover:text-yellow-400 transition">
//                         <User size={24} />
//                         <span>Login</span>
//                     </Link>

//                     <Link to="/register" className="bg-yellow-400 text-gray-900 px-4 py-1 rounded hover:bg-yellow-300 transition font-medium">
//                         Register
//                     </Link>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;