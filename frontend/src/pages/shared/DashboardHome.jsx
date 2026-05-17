import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CalendarDays } from "lucide-react";
import { StatsGrid } from "../../components/dashboard/StatsGrid";
import { TaskStatusChart } from "../../components/charts/TaskStatusChart";
import { ProductivityChart } from "../../components/charts/ProductivityChart";
import { RecentActivity } from "../../components/dashboard/RecentActivity";
import { Card } from "../../components/ui/Card";

export default function DashboardHome() {
  const { dashboard, productivity } = useSelector((state) => state.analytics);
  const { user } = useSelector((state) => state.auth);

  const stats = useMemo(() => {
    const totalTasks = dashboard?.totalTasks || 0;
    const completedTasks = dashboard?.completedTasks || 0;
    const teamCount = dashboard?.roleBreakdown?.reduce((sum, item) => sum + item.count, 0) || 0;

    return [
      { label: "Total Tasks", value: totalTasks, helper: "All tracked work" },
      { label: "Completed", value: completedTasks, helper: `${dashboard?.completionRate || 0}% success rate` },
      { label: "Open Items", value: totalTasks - completedTasks, helper: "Needs attention" },
      { label: "Workspace Users", value: user?.role === "admin" ? teamCount : "Focused", helper: "Live roster insights" }
    ];
  }, [dashboard, user?.role]);

  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <TaskStatusChart data={dashboard?.statusBreakdown || []} />
        <Card>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-brand-500/15 p-3">
              <CalendarDays className="h-5 w-5 text-brand-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Calendar Focus</h3>
              <p className="text-sm text-slate-400">Upcoming due dates and delivery planning.</p>
            </div>
          </div>
          <div className="space-y-3">
            {(dashboard?.recentTasks || []).map((task) => (
              <div key={task._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">{task.title}</p>
                <p className="mt-2 text-sm text-slate-400">
                  Assigned to {task.assignedTo?.name} by {task.assignedBy?.name}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <ProductivityChart data={productivity} />
        <RecentActivity tasks={dashboard?.recentTasks || []} />
      </div>
    </div>
  );
}
