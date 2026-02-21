"use client";

import { z } from "zod";
import { TamboComponent } from "@tambo-ai/react";
import ThreatTimelineChart from "@/components/cyber/threat-timeline-chart";
import AttackPredictionCard from "@/components/cyber/attack-prediction-card";
import ThreatEvolutionTree from "@/components/cyber/threat-evolution-tree";
import AttackPatternDetail from "@/components/cyber/attack-pattern-detail";
import SeverityPieChart from "@/components/cyber/severity-pie-chart";
import MitreTacticChart from "@/components/cyber/mitre-tactic-chart";
import SectorRiskTable from "@/components/cyber/sector-risk-table";
import GlobalThreatMap from "@/components/cyber/global-threat-map";
import ThreatSummaryDashboard from "@/components/cyber/threat-summary-dashboard";

import {
  generateTimeSeriesData,
  generatePredictions,
  generateAttackPatterns,
  generateEvolutionTree,
  generateSeverityDistribution,
  generateMitreTacticData,
  generateSectorRiskData,
  generateGlobalThreats,
  fetchTimeSeriesFromNvd,
  fetchSeverityFromNvd,
  fetchMitreTacticDistribution,
  fetchAttackPatternsFromKev,
} from "@/lib/cyber-data";

// ---- TAMBO COMPONENT REGISTRY ----
export const tamboComponents: TamboComponent[] = [
  {
    name: "ThreatTimelineChart",
    description:
      "Displays a time-series chart of cyber attack trends over the past 24 months. Shows attack frequency across categories like ransomware, APT, phishing, supply chain, zero-day, DDoS, cryptojacking, insider threats, IoT exploits, and AI-powered attacks. Use this when the user asks about attack trends, historical data, time-series analysis, or wants to see how threats have evolved over time.",
    component: ThreatTimelineChart,
    propsSchema: z.object({
      title: z.string().describe("Title for the chart").default("Cyber Attack Trend Analysis"),
      categories: z
        .array(z.string())
        .describe("Which attack categories to show. Options: ransomware, apt, phishing, supplyChain, zeroDay, ddos, cryptojacking, insiderThreat, iotExploit, aiPowered")
        .default(["ransomware", "apt", "phishing", "supplyChain", "aiPowered"]),
      months: z.number().describe("Number of months of data to show").default(24),
    }),
  },
  {
    name: "AttackPredictionCard",
    description:
      "Shows AI-generated predictions for future cyber attack trends including predicted change percentage, confidence score, risk level, and actionable recommendations. Use this when the user asks about predictions, forecasts, future threats, or what attacks are expected to increase.",
    component: AttackPredictionCard,
    propsSchema: z.object({
      category: z
        .string()
        .describe("The attack category to show prediction for. Options: AI-Powered Attacks, Supply Chain Attacks, Ransomware, IoT Exploits, APT Campaigns, Phishing, DDoS, Cryptojacking")
        .optional(),
      showAll: z.boolean().describe("Whether to show all predictions").default(false),
    }),
  },
  {
    name: "ThreatEvolutionTree",
    description:
      "Visualizes the evolutionary tree of cyber threats showing how attack types have branched and evolved over time from simple malware to sophisticated AI-powered attacks. Use this when the user asks about attack evolution, threat lineage, how attacks evolved, or the history of cyber threats.",
    component: ThreatEvolutionTree,
    propsSchema: z.object({
      title: z.string().describe("Title for the evolution tree").default("Threat Evolution Lineage"),
    }),
  },
  {
    name: "AttackPatternDetail",
    description:
      "Shows detailed information about a specific cyber attack pattern including severity, MITRE techniques, target sectors, growth rate, CVE references, and description. Use this when the user asks about a specific attack, wants details on a particular threat, or asks about attack techniques.",
    component: AttackPatternDetail,
    propsSchema: z.object({
      patternId: z
        .string()
        .describe("The ID of the attack pattern to show. Options: ap-001 (LLM Phishing), ap-002 (Dependency Confusion), ap-003 (RaaS v4), ap-004 (Firmware Implants), ap-005 (ML Poisoning), ap-006 (Quantum Harvest), ap-007 (Deepfake SE), ap-008 (Cloud Lateral Movement)")
        .optional(),
      patternName: z.string().describe("Name of the attack pattern to search for").optional(),
    }),
  },
  {
    name: "SeverityPieChart",
    description:
      "Displays a pie/donut chart showing the distribution of attack severities (Critical, High, Medium, Low). Use this when the user asks about severity distribution, risk breakdown, or how severe current threats are.",
    component: SeverityPieChart,
    propsSchema: z.object({
      title: z.string().describe("Title for the chart").default("Attack Severity Distribution"),
    }),
  },
  {
    name: "MitreTacticChart",
    description:
      "Shows a bar chart of MITRE ATT&CK tactic distribution across observed attacks. Use this when the user asks about MITRE framework, attack tactics, ATT&CK mapping, or tactical analysis.",
    component: MitreTacticChart,
    propsSchema: z.object({
      title: z.string().describe("Title for the chart").default("MITRE ATT&CK Tactic Distribution"),
    }),
  },
  {
    name: "SectorRiskTable",
    description:
      "Displays a table/grid of industry sectors with their risk scores, incident counts, vulnerability counts, and trend indicators. Use this when the user asks about which industries are most at risk, sector analysis, or industry-specific threats.",
    component: SectorRiskTable,
    propsSchema: z.object({
      title: z.string().describe("Title for the table").default("Sector Risk Assessment"),
    }),
  },
  {
    name: "GlobalThreatMap",
    description:
      "Shows a visual global threat map with regional threat levels, top attack types per region, and incident counts. Use this when the user asks about geographic threats, regional analysis, global threat landscape, or where attacks originate.",
    component: GlobalThreatMap,
    propsSchema: z.object({
      title: z.string().describe("Title for the map").default("Global Threat Landscape"),
    }),
  },
  {
    name: "ThreatSummaryDashboard",
    description:
      "Comprehensive dashboard showing key metrics: total incidents, active threats, critical alerts, and model accuracy. Use this when the user asks for an overview, summary, dashboard, or general threat landscape assessment.",
    component: ThreatSummaryDashboard,
    propsSchema: z.object({
      title: z.string().describe("Title for the dashboard").default("Threat Intelligence Summary"),
    }),
  },
];

// ---- TAMBO TOOLS ----
// Tools try real API sources first, fall back to computed data
export const tamboTools = [
  {
    name: "get-attack-patterns",
    description:
      "Retrieves the current database of tracked cyber attack patterns with details including severity, growth rate, MITRE techniques, and target sectors. Sources: CISA KEV + NVD.",
    tool: async () => {
      try { return await fetchAttackPatternsFromKev(); }
      catch { return generateAttackPatterns(); }
    },
    inputSchema: z.object({}),
    outputSchema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        category: z.string(),
        severity: z.string(),
        growthRate: z.number(),
        evolutionStage: z.string(),
        confidence: z.number(),
        description: z.string(),
      })
    ),
  },
  {
    name: "get-threat-predictions",
    description:
      "Retrieves AI model predictions for future cyber attack trends including predicted growth rates, confidence scores, and recommendations.",
    tool: () => generatePredictions(),
    inputSchema: z.object({}),
    outputSchema: z.array(
      z.object({
        category: z.string(),
        currentTrend: z.string(),
        predictedChange: z.number(),
        confidence: z.number(),
        riskLevel: z.string(),
        recommendation: z.string(),
      })
    ),
  },
  {
    name: "get-time-series-data",
    description:
      "Retrieves the time-series data of attack frequencies across all categories for the specified number of months. Sources: NVD CVE publication data.",
    tool: async (input: { months: number }) => {
      try { return await fetchTimeSeriesFromNvd(input.months); }
      catch { return generateTimeSeriesData(input.months); }
    },
    inputSchema: z.object({
      months: z.number().default(24).describe("Number of months of historical data"),
    }),
    outputSchema: z.array(z.object({ date: z.string() })),
  },
  {
    name: "get-evolution-tree",
    description: "Retrieves the threat evolution tree showing how attack types branched and evolved over time. Based on MITRE, ENISA, and threat intel reports.",
    tool: () => generateEvolutionTree(),
    inputSchema: z.object({}),
    outputSchema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        parent: z.string().nullable(),
        year: z.number(),
        severity: z.number(),
      })
    ),
  },
  {
    name: "get-sector-risks",
    description: "Retrieves risk assessment data for different industry sectors, derived from attack pattern targeting data.",
    tool: () => generateSectorRiskData(),
    inputSchema: z.object({}),
    outputSchema: z.array(
      z.object({
        sector: z.string(),
        riskScore: z.number(),
        incidents: z.number(),
        trend: z.string(),
      })
    ),
  },
  {
    name: "get-global-threats",
    description: "Retrieves global threat data showing regional threat levels and top attacks per region. Sources: ENISA, IBM X-Force, CrowdStrike reports.",
    tool: () => generateGlobalThreats(),
    inputSchema: z.object({}),
    outputSchema: z.array(
      z.object({
        region: z.string(),
        threatLevel: z.number(),
        topAttack: z.string(),
        incidents: z.number(),
      })
    ),
  },
  {
    name: "get-mitre-tactics",
    description: "Retrieves MITRE ATT&CK tactic distribution data from the real MITRE ATT&CK Enterprise matrix.",
    tool: async () => {
      try { return await fetchMitreTacticDistribution(); }
      catch { return generateMitreTacticData(); }
    },
    inputSchema: z.object({}),
    outputSchema: z.array(
      z.object({
        tactic: z.string(),
        count: z.number(),
        percentage: z.number(),
      })
    ),
  },
];
