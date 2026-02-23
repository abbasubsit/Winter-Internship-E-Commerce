// ============================================================
// Auth Service — Login, Register, Forgot/Reset Password
// ============================================================
import API from "./api";

// Register a new user (customer or seller)
export const registerUser = async ({ name, email, password, role }) => {
    const { data } = await API.post("/api/auth/register", {
        name, email, password, role,
    });
    return data;
};

// Login user
export const loginUser = async ({ email, password }) => {
    const { data } = await API.post("/api/auth/login", { email, password });
    return data;
};

// Send forgot password email
export const forgotPassword = async (email) => {
    const { data } = await API.post("/api/auth/forgot-password", { email });
    return data;
};

// Reset password using token
export const resetPassword = async (token, password) => {
    const { data } = await API.put(`/api/auth/reset-password/${token}`, { password });
    return data;
};
