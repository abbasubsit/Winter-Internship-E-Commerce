import { Facebook, Instagram, Twitter, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* 1. Brand Info */}
                    <div>
                        <h3 className="text-2xl font-bold text-yellow-400 mb-4">SMV-ECOM</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Elevate your style with our premium collection of fashion and accessories. Quality meets elegance.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition duration-300">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition duration-300">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition duration-300">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* 2. Shop Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Shop</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/menProducts" className="hover:text-yellow-400 transition">Men's Collection</Link></li>
                            <li><Link to="/womenProducts" className="hover:text-yellow-400 transition">Women's Collection</Link></li>
                            <li><Link to="/electronicProducts" className="hover:text-yellow-400 transition">Electronics</Link></li>
                            <li><Link to="/trendingProducts" className="hover:text-yellow-400 transition">Trending Now</Link></li>
                        </ul>
                    </div>

                    {/* 3. Help & Support */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/myorders" className="hover:text-yellow-400 transition">Order Status</Link></li>
                            <li><Link to="#" className="hover:text-yellow-400 transition">Shipping & Returns</Link></li>
                            <li><Link to="#" className="hover:text-yellow-400 transition">FAQ</Link></li>
                            <li><Link to="#" className="hover:text-yellow-400 transition">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* 4. Newsletter */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Stay Updated</h4>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for exclusive offers and latest updates.</p>
                        <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                            />
                            <button className="bg-yellow-400 text-gray-900 font-bold py-3 rounded hover:bg-yellow-300 transition duration-300 text-sm">
                                SUBSCRIBE
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; 2024 SMV-ECOM. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0 items-center">
                        {/* Payment Icons (Simulated) */}
                        <span className="flex items-center space-x-1"><CreditCard size={16} /> <span>Secure Payment</span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
