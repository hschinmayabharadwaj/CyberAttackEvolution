"use client";

import { useMemo } from "react";
import { generateGlobalThreats } from "@/lib/cyber-data";
import { cn } from "@/lib/utils";
import { Globe, MapPin, AlertTriangle } from "lucide-react";

interface GlobalThreatMapProps {
  title?: string;
}

export default function GlobalThreatMap({ title = "Global Threat Landscape" }: GlobalThreatMapProps) {
  const data = useMemo(() => generateGlobalThreats(), []);

  return (
    <div className="w-full rounded-2xl border border-cyan-500/20 bg-slate-900/90 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-cyan-100 tracking-wide flex items-center gap-2">
          <Globe className="h-5 w-5 text-cyan-400" />
          {title}
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Regional threat intelligence and incident distribution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data
          .sort((a, b) => b.threatLevel - a.threatLevel)
          .map((region) => {
            const levelColor =
              region.threatLevel >= 85 ? "border-red-500/40 bg-red-500/5" :
              region.threatLevel >= 75 ? "border-orange-500/40 bg-orange-500/5" :
              region.threatLevel >= 65 ? "border-yellow-500/40 bg-yellow-500/5" :
              "border-green-500/40 bg-green-500/5";
            const textColor =
              region.threatLevel >= 85 ? "text-red-400" :
              region.threatLevel >= 75 ? "text-orange-400" :
              region.threatLevel >= 65 ? "text-yellow-400" :
              "text-green-400";
            const barColor =
              region.threatLevel >= 85 ? "bg-red-500" :
              region.threatLevel >= 75 ? "bg-orange-500" :
              region.threatLevel >= 65 ? "bg-yellow-500" :
              "bg-green-500";

            return (
              <div
                key={region.region}
                className={cn(
                  "rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-default",
                  levelColor
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className={cn("h-4 w-4", textColor)} />
                    <h4 className="text-sm font-bold text-white">{region.region}</h4>
                  </div>
                  <div className={cn("text-2xl font-black", textColor)}>
                    {region.threatLevel}
                  </div>
                </div>

                {/* Threat Level Bar */}
                <div className="mb-3">
                  <div className="h-2 w-full rounded-full bg-slate-800">
                    <div
                      className={cn("h-full rounded-full transition-all duration-1000", barColor)}
                      style={{ width: `${region.threatLevel}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-500">Top Attack</p>
                    <p className="text-slate-200 font-medium">{region.topAttack}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Incidents</p>
                    <p className="text-slate-200 font-medium">{region.incidents.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        {[
          { label: "Critical (85+)", color: "bg-red-500" },
          { label: "High (75-84)", color: "bg-orange-500" },
          { label: "Elevated (65-74)", color: "bg-yellow-500" },
          { label: "Moderate (<65)", color: "bg-green-500" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={cn("h-3 w-3 rounded-sm", item.color)} />
            <span className="text-xs text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
