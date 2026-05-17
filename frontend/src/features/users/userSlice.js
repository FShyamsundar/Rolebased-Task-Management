import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (params = {}, thunkAPI) => {
  try {
    const { data } = await api.get("/users", { params });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to fetch users");
  }
});

export const createUser = createAsyncThunk("users/createUser", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post("/users", payload);
    return data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to create user");
  }
});

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, payload }, thunkAPI) => {
    try {
      const { data } = await api.put(`/users/${id}`, payload);
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to update user");
    }
  }
);

export const deleteUser = createAsyncThunk("users/deleteUser", async (id, thunkAPI) => {
  try {
    await api.delete(`/users/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to delete user");
  }
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    meta: null,
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.meta = action.payload.meta;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      });
  }
});

export default userSlice.reducer;
