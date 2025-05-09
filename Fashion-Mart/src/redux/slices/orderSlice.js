import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserOrders = createAsyncThunk(
    "order/fetchUserOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchOrderDetails = createAsyncThunk(
    "order/fetchOrderDetails",
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        totalOrders: 0,
        orderDetails: null,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.orders;
                state.totalOrders = action.payload.total;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to fetch orders";
            })
            .addCase(fetchOrderDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = {
                    ...action.payload,
                    shippingAddress: action.payload,
                    orderItems: action.payload.orderItems.map(item => ({
                        ...item,
                        product: item.product.id // Assuming nested product ID
                    }))
                };
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to fetch order details";
            });
    },
});

export default orderSlice.reducer;