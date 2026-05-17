import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchDashboardAnalytics = createAsyncThunk(
  "analytics/fetchDashboardAnalytics",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/analytics/dashboard");
      return data.analytics;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to fetch analytics"
      );
    }
  }
);

export const fetchProductivity = createAsyncThunk(
  "analytics/fetchProductivity",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/analytics/productivity");
      return data.productivity;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to fetch productivity analytics"
      );
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    dashboard: null,
    productivity: [],
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductivity.fulfilled, (state, action) => {
        state.productivity = action.payload;
      });
  }
});

export default analyticsSlice.reducer;
