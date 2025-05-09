import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createCheckoutSession = createAsyncThunk(
    'checkout/createSession',
    async (checkoutData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            // Format cart items to match backend schema
            const formattedData = {
                ...checkoutData,
                checkoutItems: checkoutData.checkoutItems.map(item => ({
                    product: item.productId || item._id, // Ensure we have a product ID
                    name: item.name,
                    qty: parseInt(item.quantity) || 1,
                    image: item.image,
                    price: parseFloat(item.price)
                }))
            };

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
                formattedData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create checkout session'
            );
        }
    }
);

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: {
        loading: false,
        error: null,
        checkoutSession: null,
    },
    reducers: {
        clearCheckoutError: (state) => {
            state.error = null;
        },
        resetCheckout: (state) => {
            state.checkoutSession = null;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCheckoutSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckoutSession.fulfilled, (state, action) => {
                state.loading = false;
                state.checkoutSession = action.payload;
                state.error = null;
            })
            .addCase(createCheckoutSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCheckoutError, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;