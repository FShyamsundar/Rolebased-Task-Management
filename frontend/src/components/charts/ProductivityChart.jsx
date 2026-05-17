import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../ui/Card";
import { monthLabels } from "../../utils/helpers";

export function ProductivityChart({ data = [] }) {
  const chartData = data.map((item) => ({
    month: monthLabels[item.month],
    tasks: item.count,
    status: item.status
  }));

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Productivity Trend</h3>
        <p className="text-sm text-slate-400">Monthly task creation and completion activity.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="tasksFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="tasks"
              stroke="#38bdf8"
              strokeWidth={3}
              fill="url(#tasksFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
