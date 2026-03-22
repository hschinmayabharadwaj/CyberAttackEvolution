"use client";

import { type DashboardView } from "@/components/sidebar";
import ThreatTimelineChart from "@/components/cyber/threat-timeline-chart";
import AttackPredictionCard from "@/components/cyber/attack-prediction-card";
import ThreatEvolutionTree from "@/components/cyber/threat-evolution-tree";
import AttackPatternDetail from "@/components/cyber/attack-pattern-detail";
import SeverityPieChart from "@/components/cyber/severity-pie-chart";
import MitreTacticChart from "@/components/cyber/mitre-tactic-chart";
import SectorRiskTable from "@/components/cyber/sector-risk-table";
import GlobalThreatMap from "@/components/cyber/global-threat-map";
import ThreatSummaryDashboard from "@/components/cyber/threat-summary-dashboard";
import { generateAttackPatterns } from "@/lib/cyber-data";

interface DashboardContentProps {
  view: DashboardView;
}

export default function DashboardContent({ view }: DashboardContentProps) {
  const patterns = generateAttackPatterns();

  switch (view) {
    case "overview":
      return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl font-bold text-cyan-100 tracking-wide">Threat Overview</h2>
            <p className="text-sm text-slate-400 mt-1">Start here for a quick snapshot before drilling into trends and predictions.</p>
          </div>
          <ThreatSummaryDashboard />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SeverityPieChart />
            <MitreTacticChart />
          </div>
          <ThreatTimelineChart categories={["ransomware", "apt", "aiPowered", "supplyChain"]} />
        </div>
      );

    case "timeline":
      return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl font-bold text-cyan-100 tracking-wide">Trend Analysis</h2>
            <p className="text-sm text-slate-400 mt-1">Review long-term behavior first, then inspect emerging categories.</p>
          </div>
          <ThreatTimelineChart
            title="Full Attack Trend Analysis"
            categories={["ransomware", "apt", "phishing", "supplyChain", "zeroDay", "ddos", "aiPowered"]}
            months={24}
          />
          <ThreatTimelineChart
            title="Emerging Threats Focus"
            categories={["aiPowered", "supplyChain", "iotExploit"]}
            months={12}
          />
        </div>
      );

    case "predictions":
      return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl font-bold text-cyan-100 tracking-wide">Forecasted Threats</h2>
            <p className="text-sm text-slate-400 mt-1">Use this view after trend analysis to prioritize near-term defense actions.</p>
          </div>
          <AttackPredictionCard showAll={true} />
        </div>
      );

    case "evolution":
      return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl font-bold text-cyan-100 tracking-wide">Evolution Lineage</h2>
            <p className="text-sm text-slate-400 mt-1">Understand how attack families branch and converge over time.</p>
          </div>
          <ThreatEvolutionTree />
        </div>
      );

    case "patterns":
      return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-cyan-100 tracking-wide">Tracked Attack Patterns</h2>
          <p className="text-sm text-slate-400 -mt-4">
            Detailed intelligence on active patterns, mapped for deeper investigation.
          </p>
          <div className="grid grid-cols-1 gap-6">
            {patterns.map((pattern) => (
              <AttackPatternDetail key={pattern.id} patternId={pattern.id} />
            ))}
          </div>
        </div>
      );

    case "severity":
      return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl font-bold text-cyan-100 tracking-wide">Severity Analysis</h2>
            <p className="text-sm text-slate-400 mt-1">Assess current risk distribution across levels.</p>
          </div>
          <SeverityPieChart />
        </div>
      );

    case "mitre":
      return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl font-bold text-cyan-100 tracking-wide">MITRE ATT&CK Mapping</h2>
            <p className="text-sm text-slate-400 mt-1">Map observed activity to tactics for defensive planning.</p>
          </div>
          <MitreTacticChart />
        </div>
      );

    case "sectors":
      return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl font-bold text-cyan-100 tracking-wide">Sector Risk</h2>
            <p className="text-sm text-slate-400 mt-1">Compare industries by risk score, incidents, and trend direction.</p>
          </div>
          <SectorRiskTable />
        </div>
      );

    case "global":
      return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl font-bold text-cyan-100 tracking-wide">Global Threats</h2>
            <p className="text-sm text-slate-400 mt-1">View regional concentration and top attack vectors.</p>
          </div>
          <GlobalThreatMap />
        </div>
      );

    default:
      return null;
  }
}
