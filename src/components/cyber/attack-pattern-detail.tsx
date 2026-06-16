"use client";

import { useMemo } from "react";
import { generateAttackPatterns, AttackPattern } from "@/lib/cyber-data";
import { cn } from "@/lib/utils";
import {
  Shield,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Target,
  Bug,
  Fingerprint,
  ExternalLink,
} from "lucide-react";

interface AttackPatternDetailProps {
  patternId?: string;
  patternName?: string;
}

const severityConfig = {
  critical: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/40", icon: AlertCircle },
  high: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/40", icon: AlertTriangle },
  medium: { bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/40", icon: Shield },
  low: { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/40", icon: Shield },
};

const stageConfig = {
  emerging: { bg: "bg-purple-500/15", text: "text-purple-400", pulse: true },
  growing: { bg: "bg-red-500/15", text: "text-red-400", pulse: true },
  mature: { bg: "bg-orange-500/15", text: "text-orange-400", pulse: false },
  declining: { bg: "bg-green-500/15", text: "text-green-400", pulse: false },
  dormant: { bg: "bg-slate-500/15", text: "text-slate-400", pulse: false },
};

function PatternCard({ pattern }: { pattern: AttackPattern }) {
  const severity = severityConfig[pattern.severity];
  const stage = stageConfig[pattern.evolutionStage];
  const SeverityIcon = severity.icon;

  return (
    <div className={cn("w-full rounded-2xl border bg-slate-900/90 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)]", severity.border)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border", severity.bg, severity.text, severity.border)}>
              <SeverityIcon className="h-3 w-3" />
              {pattern.severity}
            </div>
            <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase", stage.bg, stage.text)}>
              {stage.pulse && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-current" /></span>}
              {pattern.evolutionStage}
            </div>
          </div>
          <h3 className="text-xl font-bold text-white">{pattern.name}</h3>
          <p className="text-sm text-slate-400 mt-1 capitalize">{pattern.category.replace("-", " ")}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 leading-relaxed mb-5 border-l-2 border-cyan-500/30 pl-3">
        {pattern.description}
      </p>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/50 text-center">
          <TrendingUp className="h-4 w-4 text-red-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-red-400">+{pattern.growthRate}%</p>
          <p className="text-[10px] text-slate-500 uppercase">Growth Rate</p>
        </div>
        <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/50 text-center">
          <Target className="h-4 w-4 text-cyan-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-cyan-300">{pattern.frequency.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 uppercase">Incidents</p>
        </div>
        <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/50 text-center">
          <Fingerprint className="h-4 w-4 text-purple-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-purple-300">{(pattern.confidence * 100).toFixed(0)}%</p>
          <p className="text-[10px] text-slate-500 uppercase">Confidence</p>
        </div>
        <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/50 text-center">
          <Calendar className="h-4 w-4 text-slate-400 mx-auto mb-1" />
          <p className="text-sm font-bold text-slate-300">{pattern.firstSeen}</p>
          <p className="text-[10px] text-slate-500 uppercase">First Seen</p>
        </div>
      </div>

      {/* MITRE Techniques */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Bug className="h-3.5 w-3.5" />
          MITRE ATT&CK Techniques
        </h4>
        <div className="flex flex-wrap gap-2">
          {pattern.techniques.map((tech) => (
            <a
              key={tech}
              href={`https://attack.mitre.org/techniques/${tech.replace(".", "/")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono hover:bg-cyan-500/20 transition-colors"
            >
              {tech}
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          ))}
        </div>
      </div>

      {/* Tactics */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Tactics</h4>
        <div className="flex flex-wrap gap-2">
          {pattern.mitreTactics.map((tactic) => (
            <span key={tactic} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs">
              {tactic}
            </span>
          ))}
        </div>
      </div>

      {/* Target Sectors */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">Target Sectors</h4>
        <div className="flex flex-wrap gap-2">
          {pattern.targetSectors.map((sector) => (
            <span key={sector} className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs">
              {sector}
            </span>
          ))}
        </div>
      </div>

      {/* CVE References */}
      {pattern.cveReferences.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">CVE References</h4>
          <div className="flex flex-wrap gap-2">
            {pattern.cveReferences.map((cve) => (
              <a
                key={cve}
                href={`https://nvd.nist.gov/vuln/detail/${cve}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono hover:bg-red-500/20 transition-colors"
              >
                {cve}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AttackPatternDetail({
  patternId,
  patternName,
}: AttackPatternDetailProps) {
  const patterns = useMemo(() => generateAttackPatterns(), []);

  const selected = useMemo(() => {
    if (patternId) return patterns.find((p) => p.id === patternId);
    if (patternName) {
      return patterns.find((p) =>
        p.name.toLowerCase().includes(patternName.toLowerCase())
      );
    }
    return patterns[0];
  }, [patterns, patternId, patternName]);

  if (!selected) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
        <p className="text-slate-300">Attack pattern not found</p>
      </div>
    );
  }

  return <PatternCard pattern={selected} />;
}
