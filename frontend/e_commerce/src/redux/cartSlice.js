import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload; // Jo product naya aya

            // 1. Check karo kya item pehle se cart mein hai?
            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                // ❌ OLD LOGIC: state.cartItems = state.cartItems.map(...) -> Yeh replace kar raha tha

                // ✅ NEW LOGIC: Quantity update karo (Purani Qty + Nayi Qty)
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id
                        ? { ...x, qty: x.qty + 1 } // Sirf count badhao
                        : x
                );
            } else {
                // Agar naya hai, toh qty 1 ke sath add karo
                state.cartItems = [...state.cartItems, { ...item, qty: 1 }];
            }

            // LocalStorage update
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        // ✅ NEW: Jab logout ho to cart saaf karne ke liye
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem("cartItems");
        }
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;