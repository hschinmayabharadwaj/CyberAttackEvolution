"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { generateTimeSeriesData } from "@/lib/cyber-data";

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  ransomware: { label: "Ransomware", color: "#ef4444" },
  apt: { label: "APT", color: "#8b5cf6" },
  phishing: { label: "Phishing", color: "#f97316" },
  supplyChain: { label: "Supply Chain", color: "#ec4899" },
  zeroDay: { label: "Zero-Day", color: "#dc2626" },
  ddos: { label: "DDoS", color: "#6366f1" },
  cryptojacking: { label: "Cryptojacking", color: "#14b8a6" },
  insiderThreat: { label: "Insider Threat", color: "#a855f7" },
  iotExploit: { label: "IoT Exploit", color: "#0ea5e9" },
  aiPowered: { label: "AI-Powered", color: "#f43f5e" },
};

interface ThreatTimelineChartProps {
  title?: string;
  categories?: string[];
  months?: number;
}

export default function ThreatTimelineChart({
  title = "Cyber Attack Trend Analysis",
  categories = ["ransomware", "apt", "phishing", "supplyChain", "aiPowered"],
  months = 24,
}: ThreatTimelineChartProps) {
  const data = useMemo(() => generateTimeSeriesData(months), [months]);

  return (
    <div className="w-full rounded-2xl border border-cyan-500/20 bg-slate-900/90 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-cyan-100 tracking-wide">{title}</h3>
        <p className="text-sm text-slate-400 mt-1">
          Time-series model output • {months} months of attack frequency data
        </p>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {categories.map((cat) => (
                <linearGradient key={cat} id={`grad-${cat}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CATEGORY_CONFIG[cat]?.color || "#fff"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CATEGORY_CONFIG[cat]?.color || "#fff"} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(val) => {
                const [y, m] = val.split("-");
                return `${m}/${y.slice(2)}`;
              }}
            />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid rgba(6,182,212,0.3)",
                borderRadius: "12px",
                color: "#e2e8f0",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{ color: "#94a3b8", fontSize: "12px" }}
            />
            {categories.map((cat) => (
              <Area
                key={cat}
                type="monotone"
                dataKey={cat}
                name={CATEGORY_CONFIG[cat]?.label || cat}
                stroke={CATEGORY_CONFIG[cat]?.color || "#fff"}
                strokeWidth={2}
                fill={`url(#grad-${cat})`}
                dot={false}
                activeDot={{ r: 4, fill: CATEGORY_CONFIG[cat]?.color }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border border-slate-700 bg-slate-800/50"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: CATEGORY_CONFIG[cat]?.color }}
            />
            <span className="text-slate-300">{CATEGORY_CONFIG[cat]?.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
