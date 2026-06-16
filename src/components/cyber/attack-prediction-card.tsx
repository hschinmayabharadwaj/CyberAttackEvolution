"use client";

import { useMemo } from "react";
import { generatePredictions, PredictionResult } from "@/lib/cyber-data";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AttackPredictionCardProps {
  category?: string;
  showAll?: boolean;
}

const riskColors = {
  critical: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", glow: "shadow-red-500/20" },
  high: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", glow: "shadow-orange-500/20" },
  medium: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30", glow: "shadow-yellow-500/20" },
  low: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30", glow: "shadow-green-500/20" },
};

function PredictionCard({ prediction }: { prediction: PredictionResult }) {
  const colors = riskColors[prediction.riskLevel];
  const TrendIcon = prediction.currentTrend === "rising" ? TrendingUp : prediction.currentTrend === "declining" ? TrendingDown : Minus;
  const RiskIcon = prediction.riskLevel === "critical" ? AlertCircle : prediction.riskLevel === "high" ? AlertTriangle : prediction.riskLevel === "medium" ? Shield : CheckCircle;

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-slate-900/80 backdrop-blur-xl p-5 transition-all duration-300 hover:scale-[1.02]",
        colors.border,
        `hover:shadow-lg hover:${colors.glow}`
      )}
    >
      {/* Glow effect */}
      <div className={cn("absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500", colors.bg)} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-white">{prediction.category}</h4>
            <div className="flex items-center gap-2 mt-1">
              <TrendIcon className={cn("h-4 w-4", colors.text)} />
              <span className={cn("text-sm font-medium", colors.text)}>
                {prediction.currentTrend === "rising" ? "↑" : prediction.currentTrend === "declining" ? "↓" : "→"}{" "}
                {Math.abs(prediction.predictedChange)}% predicted change
              </span>
            </div>
          </div>
          <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase", colors.bg, colors.text, colors.border, "border")}>
            <RiskIcon className="h-3 w-3" />
            {prediction.riskLevel}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
            <p className="text-xs text-slate-500 mb-1">Next Month Est.</p>
            <p className="text-xl font-bold text-cyan-300">{prediction.nextMonthEstimate}</p>
            <p className="text-[10px] text-slate-500">incidents</p>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
            <p className="text-xs text-slate-500 mb-1">Model Confidence</p>
            <p className="text-xl font-bold text-cyan-300">{(prediction.confidence * 100).toFixed(0)}%</p>
            <div className="mt-1 h-1.5 w-full rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all"
                style={{ width: `${prediction.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/20 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Brain className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">AI Recommendation</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{prediction.recommendation}</p>
        </div>
      </div>
    </div>
  );
}

export default function AttackPredictionCard({
  category,
  showAll = false,
}: AttackPredictionCardProps) {
  const predictions = useMemo(() => generatePredictions(), []);

  const filtered = useMemo(() => {
    if (showAll) return predictions;
    if (category) {
      const found = predictions.find(
        (p) => p.category.toLowerCase().includes(category.toLowerCase())
      );
      return found ? [found] : predictions.slice(0, 3);
    }
    return predictions.slice(0, 4);
  }, [predictions, category, showAll]);

  return (
    <div className="w-full">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-cyan-100 tracking-wide flex items-center gap-2">
          <Brain className="h-5 w-5 text-cyan-400" />
          Attack Pattern Predictions
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Time-series model forecasts • Updated Feb 2026
        </p>
      </div>

      <div className={cn("grid gap-4", filtered.length === 1 ? "grid-cols-1 max-w-lg" : "grid-cols-1 md:grid-cols-2")}>
        {filtered.map((pred) => (
          <PredictionCard key={pred.category} prediction={pred} />
        ))}
      </div>
    </div>
  );
}
