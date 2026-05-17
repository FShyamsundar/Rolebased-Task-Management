import React, { forwardRef } from "react";

export const Select = forwardRef(function Select(
  { label, error, children, className = "", ...props },
  ref
) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <select
        ref={ref}
        className={`w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </label>
  );
});
