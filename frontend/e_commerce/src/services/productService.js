// ============================================================
// Product Service — CRUD + Trending + Seller Products
// ============================================================
import API, { authConfig } from "./api";

// Get all products (Public)
export const getAllProducts = async () => {
    const { data } = await API.get("/api/products");
    return data;
};

// Get single product by ID (Public)
export const getProductById = async (id) => {
    const { data } = await API.get(`/api/products/${id}`);
    return data;
};

// Get trending products (Public)
export const getTrendingProducts = async () => {
    const { data } = await API.get("/api/products/trending");
    return data;
};

// Get seller's own products (Private - Seller)
export const getMyProducts = async (token) => {
    const { data } = await API.get("/api/products/myproducts", authConfig(token));
    return data;
};

// Create a new product (Private - Seller)
export const createProduct = async (productData, token) => {
    const { data } = await API.post("/api/products", productData, authConfig(token));
    return data;
};

// Update a product (Private - Seller)
export const updateProduct = async (id, productData, token) => {
    const { data } = await API.put(`/api/products/${id}`, productData, authConfig(token));
    return data;
};

// Delete a product (Private - Seller)
export const deleteProduct = async (id, token) => {
    const { data } = await API.delete(`/api/products/${id}`, authConfig(token));
    return data;
};
