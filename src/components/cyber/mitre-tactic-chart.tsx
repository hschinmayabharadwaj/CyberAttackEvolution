"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { generateMitreTacticData } from "@/lib/cyber-data";
import { Crosshair } from "lucide-react";

interface MitreTacticChartProps {
  title?: string;
}

const GRADIENT_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6", "#8b5cf6",
];

export default function MitreTacticChart({ title = "MITRE ATT&CK Tactic Distribution" }: MitreTacticChartProps) {
  const data = useMemo(() => generateMitreTacticData(), []);

  return (
    <div className="w-full rounded-2xl border border-cyan-500/20 bg-slate-900/90 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-cyan-100 tracking-wide flex items-center gap-2">
          <Crosshair className="h-5 w-5 text-cyan-400" />
          {title}
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Distribution of observed attack techniques mapped to MITRE ATT&CK framework
        </p>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="tactic"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              width={95}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid rgba(6,182,212,0.3)",
                borderRadius: "12px",
                color: "#e2e8f0",
                fontSize: "12px",
              }}
              formatter={(value: number | string | undefined) => [Number(value ?? 0).toLocaleString(), "Incidents"]}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Row */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
        {data.slice(0, 5).map((item, i) => (
          <div key={item.tactic} className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-2 text-center">
            <p className="text-[10px] text-slate-500 truncate">{item.tactic}</p>
            <p className="text-sm font-bold" style={{ color: GRADIENT_COLORS[i] }}>
              {item.percentage}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
