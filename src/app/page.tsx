"use client";

import { useState, useMemo } from "react";
import { TamboProvider } from "@tambo-ai/react";
import Sidebar, { type DashboardView } from "@/components/sidebar";
import CyberChat from "@/components/cyber-chat";
import DashboardContent from "@/components/dashboard-content";
import { tamboComponents, tamboTools } from "@/lib/tambo-config";

function getOrCreateUserKey(): string {
  if (typeof window === "undefined") return "cyber-anon";
  const STORAGE_KEY = "cyber-evolution-user-key";
  let key = localStorage.getItem(STORAGE_KEY);
  if (!key) {
    key = `cyber-user-${crypto.randomUUID()}`;
    localStorage.setItem(STORAGE_KEY, key);
  }
  return key;
}

export default function Home() {
  const [activeView, setActiveView] = useState<DashboardView>("chat");

  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY || "";
  const userKey = useMemo(() => getOrCreateUserKey(), []);

  return (
    <TamboProvider
      apiKey={apiKey}
      userKey={userKey}
      components={tamboComponents}
      tools={tamboTools}
    >
      <div className="flex h-screen overflow-hidden bg-slate-950">
        {/* Sidebar */}
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
            <div>
              <h2 className="text-sm font-bold text-white">
                {activeView === "chat" && "AI Threat Intelligence Assistant"}
                {activeView === "overview" && "Threat Intelligence Dashboard"}
                {activeView === "timeline" && "Attack Trend Timeline"}
                {activeView === "predictions" && "Predictive Threat Analysis"}
                {activeView === "evolution" && "Threat Evolution Lineage"}
                {activeView === "patterns" && "Active Attack Patterns"}
                {activeView === "severity" && "Severity Distribution"}
                {activeView === "mitre" && "MITRE ATT&CK Analysis"}
                {activeView === "sectors" && "Sector Risk Assessment"}
                {activeView === "global" && "Global Threat Landscape"}
              </h2>
              <p className="text-[11px] text-slate-500">
                Cyber Attack Pattern Evolution Model • Powered by Time-Series AI
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs text-green-400 font-medium">Model Active</span>
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                v2.4.1 • Feb 2026
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeView === "chat" ? (
              <CyberChat />
            ) : (
              <DashboardContent view={activeView} />
            )}
          </div>
        </main>
      </div>
    </TamboProvider>
  );
}
