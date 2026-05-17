import { Bell, LogOut, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { toggleSidebar } from "../../features/ui/uiSlice";

export function Topbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          className="rounded-2xl border border-brand-200 bg-white/80 p-2.5 text-slate-700 shadow-sm lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm text-slate-500">Welcome back</p>
          <h2 className="animated-title text-2xl font-semibold text-slate-900">{user?.name}</h2>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-2xl border border-brand-200 bg-white/80 p-2.5 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-50">
          <Bell className="h-5 w-5" />
        </button>
        <button
          className="rounded-2xl border border-brand-200 bg-white/80 p-2.5 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-50 hover:text-rose-600"
          onClick={() => dispatch(logout())}
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
