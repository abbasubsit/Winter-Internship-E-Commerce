import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [],
    shippingAddress: localStorage.getItem("shippingAddress")
        ? JSON.parse(localStorage.getItem("shippingAddress"))
        : {},
    paymentMethod: 'COD',
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // ✅ NEW ACTION: Database se cart set karne ke liye
        setCart: (state, action) => {
            state.cartItems = action.payload;
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        addToCart: (state, action) => {
            const item = action.payload;
            const quantityToAdd = item.qty || 1;
            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? { ...x, qty: x.qty + quantityToAdd } : x
                );
            } else {
                state.cartItems = [...state.cartItems, { ...item, qty: quantityToAdd }];
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        increaseQty: (state, action) => {
            const itemId = action.payload;
            const existItem = state.cartItems.find((x) => x._id === itemId);
            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === itemId ? { ...x, qty: x.qty + 1 } : x
                );
                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            }
        },

        decreaseQty: (state, action) => {
            const itemId = action.payload;
            const existItem = state.cartItems.find((x) => x._id === itemId);
            if (existItem.qty === 1) {
                state.cartItems = state.cartItems.filter((x) => x._id !== itemId);
            } else {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === itemId ? { ...x, qty: x.qty - 1 } : x
                );
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem("cartItems");
        },

        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
        },

        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            localStorage.setItem("paymentMethod", JSON.stringify(action.payload));
        }
    },
});

export const {
    addToCart, increaseQty, decreaseQty, removeFromCart, clearCart,
    saveShippingAddress, savePaymentMethod, setCart // ✅ Export setCart
} = cartSlice.actions;

export default cartSlice.reducer;