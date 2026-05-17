import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: false,
    taskView: "kanban"
  },
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
    setTaskView(state, action) {
      state.taskView = action.payload;
    }
  }
});

export const { toggleSidebar, closeSidebar, setTaskView } = uiSlice.actions;
export default uiSlice.reducer;
