import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching products by collection and optional Filters
export const fetchProductsByFilters = createAsyncThunk(
    "product/fetchByFilters",
    async ({ collection, size, color, gender, minPrice, maxPrice, sortBy, search, category, material, brand, limit }) => {
        const query = new URLSearchParams();
        if (collection) query.append("collection", collection);
        if (size) query.append("size", size);
        if (category) query.append("category", category);
        if (color) query.append("color", color);
        if (gender) query.append("gender", gender);
        if (minPrice) query.append("minPrice", minPrice);
        if (maxPrice) query.append("maxPrice", maxPrice);
        if (sortBy) query.append("sortBy", sortBy);
        if (search) query.append("search", search);
        if (material) query.append("material", material);
        if (brand) query.append("brand", brand);
        if (limit) query.append("limit", limit);

        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
        );
        return response.data;
    }
);

// Async thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk(
    "products/fetchProductDetails",
    async (id) => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
        return response.data;
    }
);

// Async thunk to update product
export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ id, productData }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
            productData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data;
    }
);

// Async thunk to fetch similar products by category
export const fetchSimilarProducts = createAsyncThunk(
    "products/fetchSimilarProducts",
    async ({ id }) => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?category=${id}`);
        return response.data;
    }
);

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        productDetails: {},
        similarProducts: [],
        isLoading: false,
        error: null,
        filters: {
            collection: "",
            size: "",
            color: "",
            gender: "",
            brand: "",
            minPrice: "",
            maxPrice: "",
            sortBy: "relevance",
            search: "",
            category: "",
            material: "",
        },
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                size: "",
                color: "",
                minPrice: "",
                maxPrice: "",
                sortBy: "relevance",
                search: "",
                category: "",
                material: "",
                collection: "",
                gender: "",
                brand: "",
            };
        },
        clearProducts: (state) => {
            state.products = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsByFilters.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchProductsByFilters.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(fetchProductDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productDetails = action.payload;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(updateProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedProduct = action.payload;
                const index = state.products.findIndex((product) => product._id === updatedProduct._id);
                if (index !== -1) {
                    state.products[index] = updatedProduct;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(fetchSimilarProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.similarProducts = action.payload;
            })
            .addCase(fetchSimilarProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { setFilters, clearFilters, clearProducts } = productsSlice.actions;
export default productsSlice.reducer;