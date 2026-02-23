import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { syncCart } from "./services/cartService";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TrendingSection from "./components/TrendingSection";
import HomeCarousel from './HomeCarosel/HomeCarousel';
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailsPage from "./pages/OrderDetailspage";
import SellerLandingPage from "./pages/SellerLandingPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import MenProduct from "./pages/MenProduct";
import WomenProduct from "./pages/WomenProduct";

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password" || location.pathname.startsWith("/reset-password");

  // Auto-save cart to database
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const saveCartToDb = async () => {
      if (userInfo && cartItems.length > 0) {
        try {
          await syncCart(cartItems, userInfo.token);
          console.log("Cart synced with DB");
        } catch (error) {
          console.error("Cart sync failed:", error);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      saveCartToDb();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cartItems, userInfo]);

  return (
    <div className="min-h-screen bg-gray-100">
      {!hideLayout && <Navbar />}
      {(location.pathname === "/" || location.pathname === "/trendingProducts") && <HomeCarousel />}

      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/menProducts" element={<MenProduct />} />
        <Route path="/womenProducts" element={<WomenProduct />} />
        <Route path="/trendingProducts" element={<TrendingSection />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/seller-register" element={<SellerLandingPage />} />

        {/* --- PRIVATE ROUTES (Any logged-in user) --- */}
        <Route path="/shipping" element={<PrivateRoute><ShippingPage /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
        <Route path="/placeorder" element={<PrivateRoute><PlaceOrderPage /></PrivateRoute>} />
        <Route path="/myorders" element={<PrivateRoute><MyOrdersPage /></PrivateRoute>} />
        <Route path="/order/:id" element={<PrivateRoute><OrderDetailsPage /></PrivateRoute>} />

        {/* --- SELLER ROUTES (role: seller only) --- */}
        <Route path="/seller/dashboard" element={<RoleRoute role="seller"><SellerDashboard /></RoleRoute>} />
        <Route path="/seller/products" element={<RoleRoute role="seller"><SellerDashboard /></RoleRoute>} />
        <Route path="/seller/orders" element={<RoleRoute role="seller"><SellerDashboard /></RoleRoute>} />

        {/* --- ADMIN ROUTES (role: admin only) --- */}
        <Route path="/admin/dashboard" element={<RoleRoute role="admin"><AdminDashboard /></RoleRoute>} />
      </Routes>

      {/* Footer (Hide on Login/Register) */}
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;