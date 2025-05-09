import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to save cart to localStorage     
const saveCartToLocalStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

// Fetch cart for a user or guest 
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId, guestId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart/`, {
            params: { userId, guestId }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Add an item to the cart for a user or guest 
export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, quantity, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/`, { productId, quantity, size, color, userId, guestId });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Update the quantity of an item in the cart for a user or guest
export const updateCartItemQuantity = createAsyncThunk("cart/updateCartItemQuantity", async ({ productId, quantity, userId, guestId, size, color }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart/`, { productId, quantity, userId, guestId, size, color });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Remove an item from the cart for a user or guest
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({ productId, userId, guestId, size, color }, { rejectWithValue }) => {
    try {
        const response = await axios({ method: "DELETE", url: `${import.meta.env.VITE_BACKEND_URL}/api/cart/`, data: { productId, userId, guestId, size, color } });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Merge guest cart with user cart
export const mergeCart = createAsyncThunk("cart/mergeCarts", async ({ user, guestId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`, { user, guestId },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const initialState = {
    cart: JSON.parse(localStorage.getItem("cart")) || { products: [] },
    isLoading: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cart = { products: [] };
            localStorage.removeItem("cart"); // Clear cart from local storage
        },
        updateCartItemQuantity: (state, action) => {
            const product = action.payload;
            const existing = state.cart.products.find(p => p.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.cart.products.push({ ...product, quantity: 1 });
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload;
                saveCartToLocalStorage(action.payload);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Failed to fetch cart";
            })
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload;
                saveCartToLocalStorage(action.payload);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to fetch cart";
            })
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload;
                saveCartToLocalStorage(action.payload);
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to update cart item quantity";
            })
            .addCase(removeFromCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                saveCartToLocalStorage(action.payload);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Failed to remove item from cart";
            })
            .addCase(mergeCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload;
                saveCartToLocalStorage(action.payload);
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to merge carts";
            });
    }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;