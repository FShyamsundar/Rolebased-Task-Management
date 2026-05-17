import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { formatDate, getPriorityColor } from "../../utils/helpers";

export function RecentActivity({ tasks = [] }) {
  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <p className="text-sm text-slate-400">Latest task updates across the workspace.</p>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h4 className="font-medium text-white">{task.title}</h4>
              <p className="text-sm text-slate-400">
                {task.assignedBy?.name} assigned {task.assignedTo?.name} • {formatDate(task.updatedAt)}
              </p>
            </div>
            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
