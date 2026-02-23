// ============================================================
// Cart Service — Sync and Retrieve Cart from Database
// ============================================================
import API, { authConfig } from "./api";

// Save/Sync cart items to database (Private)
export const syncCart = async (cartItems, token) => {
    const { data } = await API.put("/api/users/cart", { cartItems }, authConfig(token));
    return data;
};

// Get user's cart from database (Private)
export const getUserCart = async (token) => {
    const { data } = await API.get("/api/users/cart", authConfig(token));
    return data;
};
