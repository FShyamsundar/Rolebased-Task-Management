import {
  BarChart3,
  BriefcaseBusiness,
  LayoutDashboard,
  Settings,
  Users
} from "lucide-react";

export const roleNavigation = {
  admin: [
    { label: "Overview", path: "/admin", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Tasks", path: "/admin/tasks", icon: BriefcaseBusiness },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { label: "Permissions", path: "/admin/settings", icon: Settings }
  ],
  manager: [
    { label: "Overview", path: "/manager", icon: LayoutDashboard },
    { label: "Team", path: "/manager/team", icon: Users },
    { label: "Tasks", path: "/manager/tasks", icon: BriefcaseBusiness },
    { label: "Performance", path: "/manager/analytics", icon: BarChart3 }
  ],
  employee: [
    { label: "Overview", path: "/employee", icon: LayoutDashboard },
    { label: "My Tasks", path: "/employee/tasks", icon: BriefcaseBusiness },
    { label: "Productivity", path: "/employee/analytics", icon: BarChart3 }
  ]
};
