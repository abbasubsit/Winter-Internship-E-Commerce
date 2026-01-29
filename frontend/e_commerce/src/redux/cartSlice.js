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
            const item = action.payload;
            const quantityToAdd = item.qty || 1;
            const existItem = state.cartItems.find((x) => x._id === item._id);

            // --- STOCK CHECK LOGIC ---
            const currentQtyInCart = existItem ? existItem.qty : 0;
            const totalQtyAfterAdd = currentQtyInCart + quantityToAdd;

            // Agar total quantity stock se zyada ho rahi hai, toh rok do
            if (item.stock && totalQtyAfterAdd > item.stock) {
                // Hum yahan kuch return nahi kar sakte jo UI pe alert dikhaye directly, 
                // lekin hum state update nahi karenge.
                // Optional: Aap chahein toh max available stock set kar dein.
                return;
            }
            // -------------------------

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id
                        ? { ...x, qty: x.qty + quantityToAdd }
                        : x
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
                // --- STOCK CHECK LOGIC ---
                // Check karo agar next qty (current + 1) stock se zyada hai
                if (existItem.stock && existItem.qty + 1 > existItem.stock) {
                    // Kuch mat karo (Quantity badhao mat)
                    return;
                }
                // -------------------------

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
        }
    },
});

export const { addToCart, increaseQty, decreaseQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;