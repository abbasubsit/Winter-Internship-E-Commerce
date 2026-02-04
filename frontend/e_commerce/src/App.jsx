import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

// Components
import Navbar from "./components/Navbar";
import TrendingSection from "./components/TrendingSection";
import HomeCarousel from './HomeCarosel/HomeCarousel';

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import SellerDashboard from "./pages/SellerDashboard"; // Dashboard Import
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";

import MenProduct from "./pages/MenProduct";
import WomenProduct from "./pages/WomenProduct";

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/register";

  // ✅ AUTO-SAVE CART LOGIC
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const saveCartToDb = async () => {
      if (userInfo && cartItems.length > 0) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          };
          await axios.put("http://localhost:5000/api/users/cart", { cartItems }, config);
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
      {!hideLayout && <HomeCarousel />}

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* --- SELLER ROUTES (Updated) --- */}
        {/* Teeno routes Dashboard ko point karenge, Dashboard URL check karke tab kholega */}
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/products" element={<SellerDashboard />} />
        <Route path="/seller/orders" element={<SellerDashboard />} />

        <Route path="/menProducts" element={<MenProduct />} />
        <Route path="/womenProducts" element={<WomenProduct />} />
        <Route path="/trendingProducts" element={<TrendingSection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/placeorder" element={<PlaceOrderPage />} />
      </Routes>
    </div>
  );
}

export default App;