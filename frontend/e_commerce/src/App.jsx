import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

// Components
import Navbar from "./components/Navbar";
import TrendingSection from "./components/TrendingSection";
// ... imports (HomePage, etc.) - Purane imports waisa hi rakhein
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import SellerDashboard from "./pages/SellerDashboard";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import HomeCarousel from './HomeCarosel/HomeCarousel';
// import ProfilePage from "./pages/ProfilePage";

// --- NEW IMPORT ---
import MenProduct from "./pages/MenProduct";
import WomenProduct from "./pages/WomenProduct";

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/register";

  // ✅ AUTO-SAVE CART LOGIC (Tumhara existing logic)
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

    // Debounce: Jab user ruk jaye tab save karo (har click par nahi)
    const timeoutId = setTimeout(() => {
      saveCartToDb();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cartItems, userInfo]); // Jab bhi cart ya user change ho

  return (
    <div className="min-h-screen bg-gray-100">
      {!hideLayout && <Navbar />}
      {/* HomeCarousel sirf Home page par dikhana chahiye ya sab par? 
          Abhi tumhare code me ye sab par dikh raha hai (except login/register). 
          Agar sirf home pe dikhana ho to condition laga dena. Filhal same rakha hai. */}
      {!hideLayout && <HomeCarousel />}

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* --- NEW ROUTE FOR MEN PAGE --- */}
        <Route path="/menProducts" element={<MenProduct />} />
        <Route path="/womenProducts" element={<WomenProduct />} />

        <Route path="/trendingProducts" element={<TrendingSection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/placeorder" element={<PlaceOrderPage />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </div>
  );
}

export default App;