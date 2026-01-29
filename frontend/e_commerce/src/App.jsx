import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import SellerDashboard from "./pages/SellerDashboard"; // Import karo
import HomeCarousel from "./HomeCarosel/HomeCarousel";

import TrendingSection from "./components/TrendingSection";
import { ImageOff } from "lucide-react";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ShippingPage from "./pages/ShippingPage"; // <-- Import karo
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";

// ... Routes ke andar add karo:


function App() {
  const location = useLocation();

  const hideLayout = location.pathname === "/login" || location.pathname ==="/register";

  return (
    <div className="min-h-screen bg-gray-100">

      {!hideLayout && <Navbar />}
      {!hideLayout && <HomeCarousel />}
     {/* Navbar hamesha upar rahega */}
      
      <Routes>
        {/* sectionName={"Men's Kurta"} */}
        <Route path="/trendingProducts" element={<TrendingSection />} />
        <Route path="/" element={<HomePage  />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/placeorder" element={<PlaceOrderPage />} />
      </Routes>
    </div>
  );
}

export default App;