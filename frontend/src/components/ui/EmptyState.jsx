import { Inbox } from "lucide-react";

export function EmptyState({ title, description }) {
  return (
    <div className="glass-panel rounded-3xl p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15">
        <Inbox className="h-7 w-7 text-brand-300" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}
