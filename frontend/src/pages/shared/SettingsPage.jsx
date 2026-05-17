import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export default function SettingsPage() {
  const permissions = [
    "manage-users",
    "manage-tasks",
    "view-analytics",
    "assign-tasks",
    "update-status"
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-900">Role Permissions</h3>
      <p className="mt-2 text-sm text-slate-500">
        This view is a UI control center for permission governance. You can connect it to a granular permissions API next.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {permissions.map((permission) => (
          <Badge key={permission} className="bg-brand-500/15 text-brand-300">
            {permission}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
