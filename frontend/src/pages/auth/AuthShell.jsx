import { Link, Outlet } from "react-router-dom";

export default function AuthShell() {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-brand-100 bg-white/85 shadow-glass lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-gradient-to-br from-amber-200 via-brand-100 to-accent-100 p-10 lg:block">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Enterprise workflow</p>
          <h1 className="animated-title mt-5 text-5xl font-semibold leading-tight text-slate-900">
            Build calm, accountable teams with one dashboard.
          </h1>
          <p className="mt-6 max-w-lg text-slate-700">
            Task Flow gives admins, managers, and employees a role-aware workspace built for scale.
          </p>
        </div>
        <div className="p-6 sm:p-10">
          <Link to="/" className="text-sm uppercase tracking-[0.35em] text-brand-600">
            Task Flow
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
