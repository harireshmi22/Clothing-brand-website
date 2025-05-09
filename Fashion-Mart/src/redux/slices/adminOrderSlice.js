import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
    'admin/fetchAllOrders',
    async (_DO_NOT_USE__ActionTypes, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// update order delivery status (admin only)
export const updateOrderStatus = createAsyncThunk(
    'admin/updateOrderStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// delete order (admin only)
export const deleteOrder = createAsyncThunk(
    'admin/deleteOrder',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const adminOrderSlice = createSlice({
    name: 'adminOrder',
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
                state.totalOrders = action.payload.length;

                // Calculate total sales
                const totalSales = action.payload.reduce((acc, order) => {
                    return acc + order.totalPrice;
                }, 0);
                state.totalSales = totalSales;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message || 'Failed to fetch orders';
            })

            // Update order status cases
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updateOrder = action.payload;
                const OrderIndex = state.orders.findIndex((order) => order._id === updateOrder._id);
                if (OrderIndex !== -1) {
                    state.orders[OrderIndex] = updateOrder; // Update the order in the state    
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Delete order cases
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter((order) => order._id !== action.payload);
            })
    },
});

export default adminOrderSlice.reducer;