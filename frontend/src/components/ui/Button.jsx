import { cn } from "../../utils/helpers";

const variants = {
  primary: "bg-brand-500 !text-white hover:-translate-y-0.5 hover:bg-brand-600",
  secondary: "bg-white text-slate-700 ring-1 ring-brand-100 hover:-translate-y-0.5 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-600 hover:bg-brand-50 hover:text-slate-900"
};

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
