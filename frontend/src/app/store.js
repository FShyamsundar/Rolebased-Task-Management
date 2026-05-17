import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import tasksReducer from "../features/tasks/taskSlice";
import usersReducer from "../features/users/userSlice";
import analyticsReducer from "../features/analytics/analyticsSlice";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    users: usersReducer,
    analytics: analyticsReducer,
    ui: uiReducer
  }
});
