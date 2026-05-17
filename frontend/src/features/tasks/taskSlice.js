import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (params = {}, thunkAPI) => {
  try {
    const { data } = await api.get("/tasks", { params });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to fetch tasks");
  }
});

export const createTask = createAsyncThunk("tasks/createTask", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post("/tasks", payload);
    return data.task;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to create task");
  }
});

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, payload }, thunkAPI) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, payload);
      return data.task;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to update task");
    }
  }
);

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id, thunkAPI) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to delete task");
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    meta: null,
    isLoading: false,
    isSaving: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.tasks;
        state.meta = action.payload.meta;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isSaving = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isSaving = false;
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      });
  }
});

export default taskSlice.reducer;
