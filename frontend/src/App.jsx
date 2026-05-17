import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./features/auth/authSlice";
import { fetchDashboardAnalytics, fetchProductivity } from "./features/analytics/analyticsSlice";
import DashboardLayout from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import AuthShell from "./pages/auth/AuthShell";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminTasksPage from "./pages/admin/AdminTasksPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerTeamPage from "./pages/manager/ManagerTeamPage";
import ManagerTasksPage from "./pages/manager/ManagerTasksPage";
import ManagerAnalyticsPage from "./pages/manager/ManagerAnalyticsPage";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeTasksPage from "./pages/employee/EmployeeTasksPage";
import EmployeeAnalyticsPage from "./pages/employee/EmployeeAnalyticsPage";

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchMe());
      dispatch(fetchDashboardAnalytics());
      dispatch(fetchProductivity());
    }
  }, [dispatch, token]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<AuthShell />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/tasks" element={<AdminTasksPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["manager"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/team" element={<ManagerTeamPage />} />
          <Route path="/manager/tasks" element={<ManagerTasksPage />} />
          <Route path="/manager/analytics" element={<ManagerAnalyticsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["employee"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/employee/tasks" element={<EmployeeTasksPage />} />
          <Route path="/employee/analytics" element={<EmployeeAnalyticsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
