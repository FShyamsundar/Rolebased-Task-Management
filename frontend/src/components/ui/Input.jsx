import React, { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { label, error, className = "", ...props },
  ref,
) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <input
        ref={ref}
        className={`w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </label>
  );
});
