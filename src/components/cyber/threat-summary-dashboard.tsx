"use client";

import { useMemo } from "react";
import {
  generateAttackPatterns,
  generatePredictions,
  generateTimeSeriesData,
} from "@/lib/cyber-data";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  Brain,
  Shield,
  TrendingUp,
  Zap,
  BarChart3,
  Clock,
} from "lucide-react";

interface ThreatSummaryDashboardProps {
  title?: string;
}

export default function ThreatSummaryDashboard({
  title = "Threat Intelligence Summary",
}: ThreatSummaryDashboardProps) {
  const patterns = useMemo(() => generateAttackPatterns(), []);
  const predictions = useMemo(() => generatePredictions(), []);
  const timeSeries = useMemo(() => generateTimeSeriesData(3), []);

  const totalIncidents = patterns.reduce((sum, p) => sum + p.frequency, 0);
  const criticalCount = patterns.filter((p) => p.severity === "critical").length;
  const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
  const growingThreats = patterns.filter((p) => p.evolutionStage === "growing" || p.evolutionStage === "emerging").length;

  const latestMonth = timeSeries[timeSeries.length - 1];
  const totalLatest = latestMonth
    ? latestMonth.ransomware +
      latestMonth.apt +
      latestMonth.phishing +
      latestMonth.supplyChain +
      latestMonth.zeroDay +
      latestMonth.ddos +
      latestMonth.cryptojacking +
      latestMonth.insiderThreat +
      latestMonth.iotExploit +
      latestMonth.aiPowered
    : 0;

  const stats = [
    {
      label: "Total Tracked Incidents",
      value: totalIncidents.toLocaleString(),
      icon: Activity,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
    },
    {
      label: "Active Threat Patterns",
      value: patterns.length.toString(),
      icon: Zap,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      label: "Critical Alerts",
      value: criticalCount.toString(),
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
    {
      label: "Model Accuracy",
      value: `${(avgConfidence * 100).toFixed(1)}%`,
      icon: Brain,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      label: "Growing/Emerging Threats",
      value: growingThreats.toString(),
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
    },
    {
      label: "Monthly Attack Volume",
      value: totalLatest.toLocaleString(),
      icon: BarChart3,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/30",
    },
  ];

  const topPredictions = predictions.filter((p) => p.riskLevel === "critical" || p.riskLevel === "high").slice(0, 3);

  return (
    <div className="w-full space-y-4">
      {/* Title */}
      <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/90 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
        <h3 className="text-lg font-bold text-cyan-100 tracking-wide flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />
          {title}
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          AI-powered threat intelligence overview • Last updated: Feb 21, 2026
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={cn(
                "rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
                stat.borderColor,
                stat.bgColor
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn("h-4 w-4", stat.color)} />
                <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              </div>
              <p className={cn("text-2xl font-black", stat.color)}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Top Threat Alerts */}
      <div className="rounded-2xl border border-red-500/20 bg-slate-900/90 backdrop-blur-xl p-5">
        <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Priority Threat Alerts
        </h4>
        <div className="space-y-2">
          {topPredictions.map((pred) => (
            <div
              key={pred.category}
              className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20"
            >
              <div>
                <p className="text-sm font-medium text-white">{pred.category}</p>
                <p className="text-xs text-slate-400">
                  +{pred.predictedChange}% predicted increase • {(pred.confidence * 100).toFixed(0)}% confidence
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-red-400 font-bold uppercase">{pred.riskLevel}</p>
                <p className="text-xs text-slate-500">{pred.nextMonthEstimate} est.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Intel */}
      <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/90 backdrop-blur-xl p-5">
        <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Latest Threat Intelligence
        </h4>
        <div className="space-y-2">
          {patterns.slice(0, 4).map((pattern) => (
            <div
              key={pattern.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  pattern.severity === "critical" ? "bg-red-500" :
                  pattern.severity === "high" ? "bg-orange-500" :
                  "bg-yellow-500"
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{pattern.name}</p>
                <p className="text-xs text-slate-500">{pattern.category} • +{pattern.growthRate}% growth</p>
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                  pattern.evolutionStage === "emerging" ? "bg-purple-500/20 text-purple-400" :
                  pattern.evolutionStage === "growing" ? "bg-red-500/20 text-red-400" :
                  "bg-orange-500/20 text-orange-400"
                )}
              >
                {pattern.evolutionStage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
