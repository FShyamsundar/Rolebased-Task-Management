import { cn } from "../../utils/helpers";

export function Badge({ children, className }) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", className)}>
      {children}
    </span>
  );
}
