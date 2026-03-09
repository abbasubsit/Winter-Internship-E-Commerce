import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { syncCart } from "./services/cartService";

// Components (always loaded - part of layout)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeCarousel from './HomeCarosel/HomeCarousel';
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";

// Lazy-loaded Pages (only downloaded when user visits the route)
const ShopPage = lazy(() => import("./pages/ShopPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const ShippingPage = lazy(() => import("./pages/ShippingPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const PlaceOrderPage = lazy(() => import("./pages/PlaceOrderPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailspage"));
const SellerLandingPage = lazy(() => import("./pages/SellerLandingPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const MenProduct = lazy(() => import("./pages/MenProduct"));
const WomenProduct = lazy(() => import("./pages/WomenProduct"));
const TrendingSection = lazy(() => import("./components/TrendingSection"));

// Loading spinner shown while a lazy page is being downloaded
const PageLoader = () => (
  <div className="flex justify-center items-center h-[60vh]">
    <div className="w-10 h-10 border-[3px] border-black border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<ShopPage />} />
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
      </Suspense>

      {/* Footer (Hide on Login/Register) */}
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;