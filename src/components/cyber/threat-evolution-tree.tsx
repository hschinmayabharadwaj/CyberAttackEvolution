"use client";

import { useMemo } from "react";
import { generateEvolutionTree, ThreatEvolutionNode } from "@/lib/cyber-data";
import { cn } from "@/lib/utils";
import { GitBranch, Calendar, AlertTriangle } from "lucide-react";

interface ThreatEvolutionTreeProps {
  title?: string;
}

function TreeNode({ node, children, depth }: { node: ThreatEvolutionNode; children: ThreatEvolutionNode[]; depth: number }) {
  const severityColor =
    node.severity >= 9 ? "from-red-500 to-red-700" :
    node.severity >= 7 ? "from-orange-500 to-orange-700" :
    node.severity >= 5 ? "from-yellow-500 to-yellow-700" :
    "from-green-500 to-green-700";

  const borderColor =
    node.severity >= 9 ? "border-red-500/40 hover:border-red-400/60" :
    node.severity >= 7 ? "border-orange-500/40 hover:border-orange-400/60" :
    node.severity >= 5 ? "border-yellow-500/40 hover:border-yellow-400/60" :
    "border-green-500/40 hover:border-green-400/60";

  const glowColor =
    node.severity >= 9 ? "hover:shadow-red-500/20" :
    node.severity >= 7 ? "hover:shadow-orange-500/20" :
    "hover:shadow-cyan-500/10";

  return (
    <div className="relative">
      <div
        className={cn(
          "group relative rounded-xl border bg-slate-900/80 backdrop-blur-sm p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default",
          borderColor,
          glowColor
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn("h-8 w-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shadow-lg", severityColor)}>
            {node.severity}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate">{node.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <Calendar className="h-3 w-3 text-slate-500" />
              <span className="text-[11px] text-slate-500">{node.year}</span>
              {node.year >= 2024 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  NEW
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">{node.description}</p>
      </div>

      {children.length > 0 && (
        <div className="ml-6 mt-2 pl-4 border-l-2 border-cyan-500/20 space-y-2">
          {children.map((child) => (
            <TreeNodeWrapper key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function TreeNodeWrapper({ node, depth }: { node: ThreatEvolutionNode; depth: number }) {
  const allNodes = useMemo(() => generateEvolutionTree(), []);
  const children = allNodes.filter((n) => n.parent === node.id);

  return <TreeNode node={node} children={children} depth={depth} />;
}

export default function ThreatEvolutionTree({ title = "Threat Evolution Lineage" }: ThreatEvolutionTreeProps) {
  const nodes = useMemo(() => generateEvolutionTree(), []);
  const roots = nodes.filter((n) => n.parent === null);

  return (
    <div className="w-full rounded-2xl border border-cyan-500/20 bg-slate-900/90 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-cyan-100 tracking-wide flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-cyan-400" />
          {title}
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          How cyber threats have evolved and branched over 2+ decades
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: "Critical (9-10)", color: "bg-red-500" },
          { label: "High (7-8)", color: "bg-orange-500" },
          { label: "Medium (5-6)", color: "bg-yellow-500" },
          { label: "Low (1-4)", color: "bg-green-500" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={cn("h-3 w-3 rounded-sm", item.color)} />
            <span className="text-xs text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
        {roots.map((root) => (
          <TreeNodeWrapper key={root.id} node={root} depth={0} />
        ))}
      </div>
    </div>
  );
}
