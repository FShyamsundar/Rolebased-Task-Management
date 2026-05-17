import { Trash2 } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatDate, getPriorityColor, getStatusColor } from "../../utils/helpers";

export function TaskTable({
  tasks,
  onEdit,
  onDelete,
  canDelete,
  canEdit = true,
  editLabel = "Edit",
  renderRowAction
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="text-slate-400">
          <tr>
            <th className="pb-4">Task</th>
            <th className="pb-4">Assignee</th>
            <th className="pb-4">Priority</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Due Date</th>
            <th className="pb-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {tasks.map((task) => (
            <tr key={task._id}>
              <td className="py-4">
                <p className="font-medium text-white">{task.title}</p>
                <p className="line-clamp-1 text-slate-400">{task.description}</p>
              </td>
              <td className="py-4 text-slate-300">{task.assignedTo?.name || "Unassigned"}</td>
              <td className="py-4">
                <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
              </td>
              <td className="py-4">
                <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
              </td>
              <td className="py-4 text-slate-300">{formatDate(task.dueDate)}</td>
              <td className="py-4">
                <div className="flex gap-2">
                  {canEdit ? (
                    <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => onEdit(task)}>
                      {editLabel}
                    </Button>
                  ) : null}
                  {renderRowAction ? renderRowAction(task) : null}
                  {canDelete ? (
                    <button className="rounded-xl p-2 text-rose-300 hover:bg-rose-500/10" onClick={() => onDelete(task._id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
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
