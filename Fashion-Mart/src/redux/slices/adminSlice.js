import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// fetch all users  (admin only)
export const fetchUsers = createAsyncThunk(
    "admin/fetchUsers",
    async () => {

        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data;
    }
);

// Add the create  user action (admin only)
export const addUser = createAsyncThunk(
    "admin/addUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


// Update user info 
export const updateUser = createAsyncThunk(
    "admin/updateUser",
    async ({ id, name, email, role }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
                { name, email, role },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


// Delete a user 
export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async (id) => {
        await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return id; // Return the ID of the deleted user for the reducer to handle
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message || "Failed to fetch users";
            })
            // Update user info cases
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const updatedUser = action.payload.user; // Get the user object from payload
                const index = state.users.findIndex((user) => user._id === updatedUser._id);
                if (index !== -1) {
                    state.users[index] = updatedUser; // Update the user in the array
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message || "Failed to update user";
            })

            // Delete user cases
            .addCase(deleteUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user._id !== action.payload); // Remove the deleted user from the array
            })

            // Add user cases
            .addCase(addUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users.push(action.payload.user); // Add the new user to the array
            })
            .addCase(addUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message || "Failed to add user";
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message || "Failed to delete user";
            }
            );
    }
});

export default adminSlice.reducer;

