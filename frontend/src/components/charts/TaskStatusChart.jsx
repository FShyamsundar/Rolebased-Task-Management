import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "../ui/Card";

const COLORS = ["#f59e0b", "#38bdf8", "#10b981", "#fb7185"];

export function TaskStatusChart({ data = [] }) {
  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Task Status Split</h3>
        <p className="text-sm text-slate-400">Track workload progression at a glance.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="_id" innerRadius={70} outerRadius={95}>
              {data.map((entry, index) => (
                <Cell key={entry._id} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
