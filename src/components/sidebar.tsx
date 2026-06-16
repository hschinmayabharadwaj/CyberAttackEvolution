"use client";

import { cn } from "@/lib/utils";
import {
  Shield,
  Activity,
  Brain,
  GitBranch,
  Globe,
  BarChart3,
  Building2,
  Crosshair,
  PieChart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

export type DashboardView =
  | "chat"
  | "overview"
  | "timeline"
  | "predictions"
  | "evolution"
  | "patterns"
  | "severity"
  | "mitre"
  | "sectors"
  | "global";

interface SidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

const navItems: { id: DashboardView; label: string; icon: typeof Shield; section?: string }[] = [
  { id: "overview", label: "Overview", icon: Activity, section: "Start Here" },
  { id: "timeline", label: "Attack Timeline", icon: BarChart3, section: "Core Analysis" },
  { id: "predictions", label: "Predictions", icon: Brain },
  { id: "evolution", label: "Evolution Tree", icon: GitBranch },
  { id: "patterns", label: "Attack Patterns", icon: Shield, section: "Threat Intelligence" },
  { id: "mitre", label: "MITRE ATT&CK", icon: Crosshair },
  { id: "severity", label: "Severity", icon: PieChart },
  { id: "sectors", label: "Sector Risk", icon: Building2 },
  { id: "global", label: "Global Threats", icon: Globe },
  { id: "chat", label: "AI Assistant", icon: MessageSquare, section: "Ask AI" },
];

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen flex flex-col border-r border-slate-800/50 bg-slate-950/95 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800/50">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 shadow-lg shadow-cyan-500/10 flex-shrink-0">
          <Shield className="h-5 w-5 text-cyan-400" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 truncate">
              CyberEvolution AI
            </h1>
            <p className="text-[10px] text-slate-500 truncate">Threat Intelligence Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <div key={item.id}>
              {item.section && !collapsed && (
                <p className={cn("text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-3", index > 0 ? "mt-5 mb-2" : "mb-2")}>
                  {item.section}
                </p>
              )}
              {item.section && collapsed && index > 0 && <div className="my-2 mx-3 border-t border-slate-800/50" />}
              <button
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/5"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn("h-4 w-4 flex-shrink-0", isActive && "text-cyan-400")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {isActive && !collapsed && item.id === "chat" && (
                  <Sparkles className="h-3 w-3 ml-auto text-cyan-400" />
                )}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="border-t border-slate-800/50 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
