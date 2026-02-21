"use client";

import { useMemo } from "react";
import { generateSectorRiskData } from "@/lib/cyber-data";
import { cn } from "@/lib/utils";
import { Building2, TrendingUp, TrendingDown, Minus, Bug, AlertTriangle } from "lucide-react";

interface SectorRiskTableProps {
  title?: string;
}

export default function SectorRiskTable({ title = "Sector Risk Assessment" }: SectorRiskTableProps) {
  const data = useMemo(() => generateSectorRiskData(), []);

  return (
    <div className="w-full rounded-2xl border border-cyan-500/20 bg-slate-900/90 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-cyan-100 tracking-wide flex items-center gap-2">
          <Building2 className="h-5 w-5 text-cyan-400" />
          {title}
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Industry-specific risk assessment and threat intelligence
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Sector</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk Score</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Incidents</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vulnerabilities</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const riskColor =
                row.riskScore >= 85 ? "text-red-400" :
                row.riskScore >= 75 ? "text-orange-400" :
                "text-yellow-400";
              const riskBg =
                row.riskScore >= 85 ? "bg-red-500/20" :
                row.riskScore >= 75 ? "bg-orange-500/20" :
                "bg-yellow-500/20";
              const TrendIcon = row.trend === "rising" ? TrendingUp : row.trend === "declining" ? TrendingDown : Minus;
              const trendColor = row.trend === "rising" ? "text-red-400" : row.trend === "declining" ? "text-green-400" : "text-slate-400";

              return (
                <tr
                  key={row.sector}
                  className={cn(
                    "border-b border-slate-800/50 transition-colors hover:bg-slate-800/40",
                    index % 2 === 0 ? "bg-slate-800/10" : ""
                  )}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-slate-400" />
                      </div>
                      <span className="text-sm font-medium text-white">{row.sector}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-2">
                      <span className={cn("text-sm font-bold", riskColor)}>{row.riskScore}</span>
                      <div className="w-16 h-2 rounded-full bg-slate-700">
                        <div
                          className={cn("h-full rounded-full transition-all", riskBg)}
                          style={{ width: `${row.riskScore}%`, backgroundColor: row.riskScore >= 85 ? "#ef4444" : row.riskScore >= 75 ? "#f97316" : "#eab308" }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm text-slate-300">{row.incidents.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <Bug className="h-3 w-3 text-slate-500" />
                      <span className="text-sm text-slate-300">{row.vulnerabilities}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className={cn("inline-flex items-center gap-1", trendColor)}>
                      <TrendIcon className="h-4 w-4" />
                      <span className="text-xs font-medium capitalize">{row.trend}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
