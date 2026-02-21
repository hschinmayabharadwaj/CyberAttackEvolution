"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { generateSeverityDistribution } from "@/lib/cyber-data";
import { ShieldAlert } from "lucide-react";

interface SeverityPieChartProps {
  title?: string;
}

export default function SeverityPieChart({ title = "Attack Severity Distribution" }: SeverityPieChartProps) {
  const data = useMemo(() => generateSeverityDistribution(), []);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="w-full rounded-2xl border border-cyan-500/20 bg-slate-900/90 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-cyan-100 tracking-wide flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-cyan-400" />
          {title}
        </h3>
        <p className="text-sm text-slate-400 mt-1">Current threat landscape severity breakdown</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="h-[280px] w-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(6,182,212,0.3)",
                  borderRadius: "12px",
                  color: "#e2e8f0",
                  fontSize: "12px",
                }}
                formatter={(value: number | undefined) => [`${value ?? 0}%`, "Percentage"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-4">
              <div
                className="h-4 w-4 rounded-md shadow-lg"
                style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}40` }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-200">{item.name}</span>
                  <span className="text-sm font-bold text-white">{item.value}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
