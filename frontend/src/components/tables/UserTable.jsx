import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export function UserTable({ users, onEdit, onDelete, canDelete, canEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="text-slate-400">
          <tr>
            <th className="pb-4">Name</th>
            <th className="pb-4">Email</th>
            <th className="pb-4">Role</th>
            <th className="pb-4">Department</th>
            <th className="pb-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="py-4 font-medium text-white">{user.name}</td>
              <td className="py-4 text-slate-300">{user.email}</td>
              <td className="py-4">
                <Badge className="bg-brand-500/15 text-brand-300">{user.role}</Badge>
              </td>
              <td className="py-4 text-slate-300">{user.department}</td>
              <td className="py-4">
                <div className="flex gap-2">
                  {canEdit ? (
                    <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => onEdit(user)}>
                      Edit
                    </Button>
                  ) : null}
                  {canDelete ? (
                    <Button variant="ghost" className="px-3 py-2 text-xs text-rose-300" onClick={() => onDelete(user._id)}>
                      Delete
                    </Button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
