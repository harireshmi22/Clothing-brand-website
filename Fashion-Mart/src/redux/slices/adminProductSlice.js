import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem('token')}`;

// async thunk for fetching admin products (admin only)
export const fetchAdminProducts = createAsyncThunk(
    'admin/fetchAdminProducts',
    async () => {
        const response = await axios.get(`${API_URL}/api/admin/products`, {
            headers: {
                Authorization: USER_TOKEN,
            },
        });
        return response.data;
    }
);

// async thunk for creating a new product (admin only)
export const createProduct = createAsyncThunk(
    'admin/createProduct',
    async (productData) => {

        const response = await axios.post(`${API_URL}/api/admin/products`, productData, {
            headers: {
                Authorization: USER_TOKEN,
            },
        });
        return response.data;
    }
);

// async thunk for updating a existing product (admin only)
export const updateProduct = createAsyncThunk(
    'adminProducts/updateProduct',
    async ({ id, productData }) => {
        const response = await axios.put(`${API_URL}/api/admin/products/${id}`, productData, {
            headers: {
                Authorization: USER_TOKEN,
            },
        });
        return response.data;
    }
);

// async thunk for deleting a product (admin only)

export const deleteProduct = createAsyncThunk(
    'admin/deleteProduct',
    async (id) => {
        await axios.delete(`${API_URL}/api/products/${id}`, {
            headers: {
                Authorization: USER_TOKEN,
            },
        });
        return id;
    }
);


const adminProductsSlice = createSlice({
    name: 'adminProducts',
    initialState: {
        products: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch admin products cases
            .addCase(fetchAdminProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message || 'Failed to fetch products';
            })
            // Create product cases 
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message || 'Failed to create product';
            })
            // Update product cases 
            .addCase(updateProduct.fulfilled, (state, action) => {

                const index = state.products.findIndex((product) => product._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message || 'Failed to update product';
            })
            // Delete product cases
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter((product) => product._id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.payload.message || 'Failed to delete product';
            });
    }

});

export default adminProductsSlice.reducer;