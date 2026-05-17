import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { roleNavigation } from "../../constants/navigation";
import { closeSidebar } from "../../features/ui/uiSlice";
import { cn } from "../../utils/helpers";

export function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const items = user ? roleNavigation[user.role] : [];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-orange-100/70 backdrop-blur-sm lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
        onClick={() => dispatch(closeSidebar())}
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-72 border-r border-brand-100 bg-white/95 p-6 shadow-[0_20px_80px_rgba(251,146,60,0.12)] backdrop-blur-xl transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-500">Task Flow</p>
            <h1 className="animated-title mt-2 text-2xl font-semibold text-slate-900">Ops Command</h1>
          </div>
          <button className="rounded-xl p-2 text-slate-500 lg:hidden" onClick={() => dispatch(closeSidebar())}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => dispatch(closeSidebar())}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-orange-200"
                    : "text-slate-600 hover:bg-brand-50 hover:text-slate-900"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
