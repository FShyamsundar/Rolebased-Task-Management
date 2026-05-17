import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";

export default function DashboardLayout() {
  return (
    <div className="page-shell min-h-screen">
      <Sidebar />
      <main className="min-h-screen px-4 py-4 lg:ml-72 lg:px-8 lg:py-8">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
}
