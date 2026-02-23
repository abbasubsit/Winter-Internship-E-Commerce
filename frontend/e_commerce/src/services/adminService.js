// ============================================================
// Admin Service — Users, Sellers, Orders, Product Management
// ============================================================
import API, { authConfig } from "./api";

// Get all users (Private - Admin)
export const getAllUsers = async (token) => {
    const { data } = await API.get("/api/admin/users", authConfig(token));
    return data;
};

// Get all sellers (Private - Admin)
export const getAllSellers = async (token) => {
    const { data } = await API.get("/api/admin/sellers", authConfig(token));
    return data;
};

// Get all orders (Private - Admin)
export const getAllOrders = async (token) => {
    const { data } = await API.get("/api/admin/orders", authConfig(token));
    return data;
};

// Delete a user (Private - Admin)
export const deleteUser = async (id, token) => {
    const { data } = await API.delete(`/api/admin/users/${id}`, authConfig(token));
    return data;
};

// Verify/Approve a seller (Private - Admin)
export const verifySeller = async (id, token) => {
    const { data } = await API.put(`/api/admin/users/${id}/verify`, {}, authConfig(token));
    return data;
};

// Delete any product (Private - Admin)
export const deleteProductAdmin = async (id, token) => {
    const { data } = await API.delete(`/api/admin/products/${id}`, authConfig(token));
    return data;
};
