import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null, // Restore session from localStorage if previously logged in
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // On successful login
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            // Persist in localStorage so user stays logged in after refresh
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
        },
        // On logout
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem("userInfo");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;