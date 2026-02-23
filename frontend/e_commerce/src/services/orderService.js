// ============================================================
// Order Service — Create, Track, Seller Orders
// ============================================================
import API, { authConfig } from "./api";

// Create a new order (Private - Customer)
export const createOrder = async (orderData, token) => {
    const { data } = await API.post("/api/orders", orderData, authConfig(token));
    return data;
};

// Get logged-in customer's orders (Private)
export const getMyOrders = async (token) => {
    const { data } = await API.get("/api/orders/myorders", authConfig(token));
    return data;
};

// Get single order by ID (Private)
export const getOrderById = async (id, token) => {
    const { data } = await API.get(`/api/orders/${id}`, authConfig(token));
    return data;
};

// Get seller's orders (Private - Seller)
export const getSellerOrders = async (token) => {
    const { data } = await API.get("/api/orders/sellerorders", authConfig(token));
    return data;
};

// Update order status (Private - Seller)
export const updateOrderStatus = async (orderId, status, token) => {
    const { data } = await API.put(`/api/orders/${orderId}/status`, { status }, authConfig(token));
    return data;
};
