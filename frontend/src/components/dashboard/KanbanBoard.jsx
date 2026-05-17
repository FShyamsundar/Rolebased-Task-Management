import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { formatDate, getPriorityColor } from "../../utils/helpers";

const columns = [
  { key: "pending", label: "Pending" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "overdue", label: "Overdue" }
];

export function KanbanBoard({ tasks, onSelect, renderTaskAction }) {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {columns.map((column) => (
        <Card key={column.key} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">{column.label}</h3>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-300">
              {tasks.filter((task) => task.status === column.key).length}
            </span>
          </div>
          <div className="space-y-3">
            {tasks
              .filter((task) => task.status === column.key)
              .map((task) => (
                <div
                  key={task._id}
                  className={`w-full rounded-2xl border border-brand-100 bg-white/80 p-4 text-left transition hover:border-brand-300 ${
                    onSelect ? "cursor-pointer hover:-translate-y-1" : ""
                  }`}
                  onClick={() => onSelect?.(task)}
                >
                  <p className="font-medium text-white">{task.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">{task.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    <span className="text-xs text-slate-400">{formatDate(task.dueDate)}</span>
                  </div>
                  {renderTaskAction ? (
                    <div className="mt-4" onClick={(event) => event.stopPropagation()}>
                      {renderTaskAction(task)}
                    </div>
                  ) : null}
                </div>
              ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
