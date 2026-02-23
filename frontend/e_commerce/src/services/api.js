// ============================================================
// Central Axios Instance
// Single source for API base URL — change here for deployment
// ============================================================
import axios from "axios";

// Base URL for all API requests (set VITE_API_URL in .env for deployment)
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Pre-configured axios instance
const API = axios.create({
    baseURL: BASE_URL,
});

// Helper: Generate auth config with Bearer token
export const authConfig = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

export default API;
