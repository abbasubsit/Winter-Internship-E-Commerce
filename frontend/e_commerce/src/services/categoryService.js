// ============================================================
// Category Service — Get and Create Categories
// ============================================================
import API, { authConfig } from "./api";

// Get all categories (Public)
export const getAllCategories = async () => {
    const { data } = await API.get("/api/categories");
    return data;
};

// Create a new category (Private - Admin/Seller)
export const createCategory = async (name, token) => {
    const { data } = await API.post("/api/categories", { name }, authConfig(token));
    return data;
};
