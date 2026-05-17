import { CheckCircle2, Clock3, Target, Users2 } from "lucide-react";
import { Card } from "../ui/Card";

const cardIcons = [Target, CheckCircle2, Clock3, Users2];

export function StatsGrid({ stats = [] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = cardIcons[index % cardIcons.length];
        return (
          <Card key={stat.label} className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 to-cyan-300" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-emerald-300">{stat.helper}</p>
              </div>
              <div className="rounded-2xl bg-brand-500/15 p-3">
                <Icon className="h-5 w-5 text-brand-300" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
