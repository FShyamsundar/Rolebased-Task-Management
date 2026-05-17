import clsx from "clsx";

export const cn = (...classes) => clsx(classes);

export const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

export const getStatusColor = (status) =>
  ({
    pending: "bg-amber-500/15 text-amber-300",
    "in-progress": "bg-sky-500/15 text-sky-300",
    completed: "bg-emerald-500/15 text-emerald-300",
    overdue: "bg-rose-500/15 text-rose-300"
  })[status] || "bg-slate-500/15 text-slate-200";

export const getPriorityColor = (priority) =>
  ({
    low: "bg-slate-400/15 text-slate-300",
    medium: "bg-indigo-500/15 text-indigo-300",
    high: "bg-orange-500/15 text-orange-300",
    critical: "bg-rose-500/15 text-rose-300"
  })[priority] || "bg-slate-500/15 text-slate-200";

export const monthLabels = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
