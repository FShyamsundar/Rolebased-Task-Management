import { useSelector } from "react-redux";
import { ProductivityChart } from "../../components/charts/ProductivityChart";
import { TaskStatusChart } from "../../components/charts/TaskStatusChart";
import { Card } from "../../components/ui/Card";

export default function AnalyticsPage() {
  const { dashboard, productivity } = useSelector((state) => state.analytics);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <TaskStatusChart data={dashboard?.statusBreakdown || []} />
        <ProductivityChart data={productivity} />
      </div>
      <Card>
        <h3 className="text-lg font-semibold text-white">Performance Snapshot</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Completion Rate</p>
            <p className="mt-2 text-3xl font-semibold text-white">{dashboard?.completionRate || 0}%</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Completed Tasks</p>
            <p className="mt-2 text-3xl font-semibold text-white">{dashboard?.completedTasks || 0}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Total Tasks</p>
            <p className="mt-2 text-3xl font-semibold text-white">{dashboard?.totalTasks || 0}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
