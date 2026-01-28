import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null, // Agar pehle se login tha toh wahan se utha lo
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Jab login successful ho
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            // Browser ki memory mein bhi save karo taaki refresh pe na ude
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
        },
        // Jab logout kare
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem("userInfo");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;