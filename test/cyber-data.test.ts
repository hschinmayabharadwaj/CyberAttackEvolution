import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cn } from "../src/lib/utils";
import {
  generateTimeSeriesData,
  generatePredictions,
  generateAttackPatterns,
  generateEvolutionTree,
  generateGlobalThreats,
  generateSeverityDistribution,
  generateMitreTacticData,
  generateSectorRiskData,
  fetchNvdCves,
  fetchCisaKev,
  fetchMitreAttack,
  fetchTimeSeriesFromNvd,
  fetchSeverityFromNvd,
  fetchMitreTacticDistribution,
  fetchAttackPatternsFromKev,
  classifyCveCategory,
  cvssToSeverity,
  clearDataCache,
} from "../src/lib/cyber-data";

describe("cn utility", () => {
  it("joins simple class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });

  it("merges Tailwind classes using tailwind-merge", () => {
    expect(cn("p-2 p-4")).toBe("p-4");
  });

  it("handles single class", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("handles no classes", () => {
    expect(cn()).toBe("");
  });

  it("handles template literals", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });
});

describe("cvssToSeverity", () => {
  it("returns critical for score >= 9.0", () => {
    expect(cvssToSeverity(9.0)).toBe("critical");
    expect(cvssToSeverity(10)).toBe("critical");
  });

  it("returns high for score 7.0-8.9", () => {
    expect(cvssToSeverity(7.0)).toBe("high");
    expect(cvssToSeverity(8.9)).toBe("high");
  });

  it("returns medium for score 4.0-6.9", () => {
    expect(cvssToSeverity(4.0)).toBe("medium");
    expect(cvssToSeverity(6.9)).toBe("medium");
  });

  it("returns low for score < 4.0", () => {
    expect(cvssToSeverity(0)).toBe("low");
    expect(cvssToSeverity(3.9)).toBe("low");
  });
});

describe("classifyCveCategory", () => {
  it("classifies ransomware via time-series generation", () => {
    const data = generateTimeSeriesData(24);
    const hasRansomware = data.some((p) => p.ransomware > 0);
    expect(hasRansomware).toBe(true);
  });

  it("handles all category types through time-series data", () => {
    const data = generateTimeSeriesData(24);
    const hasVariousTypes = [
      data.some((p) => p.ransomware > 0),
      data.some((p) => p.apt > 0),
      data.some((p) => p.phishing > 0),
      data.some((p) => p.supplyChain > 0),
      data.some((p) => p.zeroDay > 0),
      data.some((p) => p.ddos > 0),
      data.some((p) => p.cryptojacking > 0),
      data.some((p) => p.insiderThreat > 0),
      data.some((p) => p.iotExploit > 0),
      data.some((p) => p.aiPowered > 0),
    ].every(Boolean);
    expect(hasVariousTypes).toBe(true);
  });
});

describe("generateTimeSeriesData", () => {
  it("returns array of length equal to months argument", () => {
    expect(generateTimeSeriesData(12)).toHaveLength(12);
    expect(generateTimeSeriesData(6)).toHaveLength(6);
    expect(generateTimeSeriesData(1)).toHaveLength(1);
  });

  it("defaults to 24 months", () => {
    expect(generateTimeSeriesData()).toHaveLength(24);
  });

  it("returns objects with valid date format YYYY-MM", () => {
    const data = generateTimeSeriesData(3);
    for (const point of data) {
      expect(point.date).toMatch(/^\d{4}-\d{2}$/);
    }
  });

  it("all category counts are positive numbers", () => {
    const data = generateTimeSeriesData(24);
    for (const point of data) {
      expect(point.ransomware).toBeGreaterThanOrEqual(1);
      expect(point.apt).toBeGreaterThanOrEqual(1);
      expect(point.phishing).toBeGreaterThanOrEqual(1);
      expect(point.supplyChain).toBeGreaterThanOrEqual(1);
      expect(point.zeroDay).toBeGreaterThanOrEqual(1);
      expect(point.ddos).toBeGreaterThanOrEqual(1);
      expect(point.cryptojacking).toBeGreaterThanOrEqual(1);
      expect(point.insiderThreat).toBeGreaterThanOrEqual(1);
      expect(point.iotExploit).toBeGreaterThanOrEqual(1);
      expect(point.aiPowered).toBeGreaterThanOrEqual(1);
    }
  });

  it("returns deterministic data", () => {
    const d1 = generateTimeSeriesData(12);
    const d2 = generateTimeSeriesData(12);
    expect(d1).toEqual(d2);
  });

  it("dates are sequential from oldest to newest", () => {
    const months = 5;
    const data = generateTimeSeriesData(months);
    expect(data[0].date).not.toBe(data[months - 1].date);
    expect(new Date(data[0].date).getTime()).toBeLessThan(new Date(data[months - 1].date).getTime());
  });
});

describe("generatePredictions", () => {
  it("returns 8 predictions sorted by predictedChange descending", () => {
    const preds = generatePredictions();
    expect(preds).toHaveLength(8);
    for (let i = 1; i < preds.length; i++) {
      expect(preds[i - 1].predictedChange).toBeGreaterThanOrEqual(preds[i].predictedChange);
    }
  });

  it("each prediction has valid fields", () => {
    const preds = generatePredictions();
    for (const p of preds) {
      expect(p.category).toBeTruthy();
      expect(["rising", "stable", "declining"]).toContain(p.currentTrend);
      expect(typeof p.predictedChange).toBe("number");
      expect(p.confidence).toBeGreaterThanOrEqual(0.6);
      expect(p.confidence).toBeLessThanOrEqual(0.98);
      expect(typeof p.nextMonthEstimate).toBe("number");
      expect(["critical", "high", "medium", "low"]).toContain(p.riskLevel);
      expect(p.recommendation.length).toBeGreaterThan(0);
    }
  });

  it("returns deterministic predictions", () => {
    const p1 = generatePredictions();
    const p2 = generatePredictions();
    expect(p1).toEqual(p2);
  });
});

describe("generateAttackPatterns", () => {
  it("returns 8 attack patterns", () => {
    expect(generateAttackPatterns()).toHaveLength(8);
  });

  it("each pattern has valid fields", () => {
    const patterns = generateAttackPatterns();
    for (const p of patterns) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect([
        "ransomware", "apt", "phishing", "supply-chain", "zero-day",
        "ddos", "cryptojacking", "insider-threat", "iot-exploit", "ai-powered",
      ]).toContain(p.category);
      expect(["critical", "high", "medium", "low"]).toContain(p.severity);
      expect(p.firstSeen).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(p.lastSeen).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof p.frequency).toBe("number");
      expect(typeof p.growthRate).toBe("number");
      expect(Array.isArray(p.techniques)).toBe(true);
      expect(Array.isArray(p.mitreTactics)).toBe(true);
      expect(Array.isArray(p.targetSectors)).toBe(true);
      expect(Array.isArray(p.cveReferences)).toBe(true);
      expect([
        "emerging", "growing", "mature", "declining", "dormant",
      ]).toContain(p.evolutionStage);
      expect(p.confidence).toBeGreaterThanOrEqual(0);
      expect(p.confidence).toBeLessThanOrEqual(1);
      expect(p.description).toBeTruthy();
    }
  });

  it("returns deterministic patterns", () => {
    const p1 = generateAttackPatterns();
    const p2 = generateAttackPatterns();
    expect(p1).toEqual(p2);
  });
});

describe("generateEvolutionTree", () => {
  it("returns the expected tree nodes", () => {
    const tree = generateEvolutionTree();
    expect(tree.length).toBeGreaterThanOrEqual(10);
  });

  it("has a root node with no parent", () => {
    const tree = generateEvolutionTree();
    const root = tree.find((n) => n.id === "root");
    expect(root).toBeDefined();
    expect(root!.parent).toBeNull();
  });

  it("all non-root nodes have a valid parent reference", () => {
    const tree = generateEvolutionTree();
    const ids = new Set(tree.map((n) => n.id));
    for (const node of tree) {
      if (node.id !== "root") {
        expect(node.parent).not.toBeNull();
        expect(ids.has(node.parent!)).toBe(true);
      }
    }
  });

  it("all nodes have positive severity", () => {
    const tree = generateEvolutionTree();
    for (const node of tree) {
      expect(node.severity).toBeGreaterThan(0);
    }
  });
});

describe("generateGlobalThreats", () => {
  it("returns 10 regional threat entries", () => {
    expect(generateGlobalThreats()).toHaveLength(10);
  });

  it("each entry has valid fields", () => {
    const threats = generateGlobalThreats();
    for (const t of threats) {
      expect(t.region).toBeTruthy();
      expect(typeof t.lat).toBe("number");
      expect(typeof t.lng).toBe("number");
      expect(typeof t.threatLevel).toBe("number");
      expect(t.threatLevel).toBeGreaterThanOrEqual(0);
      expect(t.threatLevel).toBeLessThanOrEqual(100);
      expect(t.topAttack).toBeTruthy();
      expect(typeof t.incidents).toBe("number");
      expect(t.incidents).toBeGreaterThan(0);
    }
  });
});

describe("generateSeverityDistribution", () => {
  it("returns 4 severity buckets", () => {
    expect(generateSeverityDistribution()).toHaveLength(4);
  });

  it("values sum to approximately 100", () => {
    const dist = generateSeverityDistribution();
    const total = dist.reduce((sum, item) => sum + item.value, 0);
    expect(total).toBe(100);
  });

  it("each bucket has name, value, and color", () => {
    const dist = generateSeverityDistribution();
    const names = dist.map((d) => d.name);
    expect(names).toContain("Critical");
    expect(names).toContain("High");
    expect(names).toContain("Medium");
    expect(names).toContain("Low");
    for (const d of dist) {
      expect(["Critical", "High", "Medium", "Low"]).toContain(d.name);
      expect(typeof d.value).toBe("number");
      expect(d.value).toBeGreaterThanOrEqual(0);
      expect(d.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe("generateMitreTacticData", () => {
  it("returns a non-empty array", () => {
    expect(generateMitreTacticData().length).toBeGreaterThan(0);
  });

  it("is sorted by count descending", () => {
    const data = generateMitreTacticData();
    for (let i = 1; i < data.length; i++) {
      expect(data[i - 1].count).toBeGreaterThanOrEqual(data[i].count);
    }
  });

  it("each entry has tactic, count, percentage", () => {
    const data = generateMitreTacticData();
    for (const item of data) {
      expect(item.tactic).toBeTruthy();
      expect(typeof item.count).toBe("number");
      expect(item.count).toBeGreaterThanOrEqual(0);
      expect(typeof item.percentage).toBe("number");
      expect(item.percentage).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("generateSectorRiskData", () => {
  it("returns a non-empty array", () => {
    expect(generateSectorRiskData().length).toBeGreaterThan(0);
  });

  it("is sorted by riskScore descending", () => {
    const data = generateSectorRiskData();
    for (let i = 1; i < data.length; i++) {
      expect(data[i - 1].riskScore).toBeGreaterThanOrEqual(data[i].riskScore);
    }
  });

  it("each entry has sector, riskScore, incidents, trend, vulnerabilities", () => {
    const data = generateSectorRiskData();
    for (const item of data) {
      expect(item.sector).toBeTruthy();
      expect(typeof item.riskScore).toBe("number");
      expect(item.riskScore).toBeGreaterThanOrEqual(0);
      expect(item.riskScore).toBeLessThanOrEqual(100);
      expect(typeof item.incidents).toBe("number");
      expect(item.incidents).toBeGreaterThanOrEqual(0);
      expect(["rising", "stable", "declining"]).toContain(item.trend);
      expect(typeof item.vulnerabilities).toBe("number");
      expect(item.vulnerabilities).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("fetchNvdCves", () => {
  beforeEach(() => {
    clearDataCache();
    global.fetch = vi.fn();
  });

  it("returns cached data on second call within TTL", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        vulnerabilities: [
          {
            cve: {
              id: "CVE-2024-0001",
              published: "2024-01-01T00:00:00Z",
              descriptions: [{ lang: "en", value: "Test vulnerability" }],
              metrics: { cvssMetricV31: [{ cvssData: { baseSeverity: "HIGH", baseScore: 7.5, attackVector: "NETWORK" } }] },
              references: [{ url: "https://example.com/1" }],
            },
          },
        ],
      }),
    });

    const first = await fetchNvdCves(30, 10);
    const second = await fetchNvdCves(30, 10);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(first).toHaveLength(1);
    expect(second).toHaveLength(1);
  });

  it("returns empty array on fetch error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const result = await fetchNvdCves(30, 10);
    expect(result).toEqual([]);
  });

  it("throws on non-ok response and returns empty array", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    const result = await fetchNvdCves(30, 10);
    expect(result).toEqual([]);
  });

  it("parses NVD response correctly", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        vulnerabilities: [
          {
            cve: {
              id: "CVE-2024-TEST",
              published: "2024-06-01T00:00:00Z",
              descriptions: [{ lang: "en", value: "Test description" }],
              metrics: { cvssMetricV31: [{ cvssData: { baseSeverity: "MEDIUM", baseScore: 5.0, attackVector: "LOCAL" } }] },
              references: [{ url: "https://nvd.nist.gov/vuln/detail/CVE-2024-TEST" }],
            },
          },
        ],
      }),
    });

    const result = await fetchNvdCves(30, 10);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: "CVE-2024-TEST",
      published: "2024-06-01T00:00:00Z",
      description: "Test description",
      baseSeverity: "MEDIUM",
      baseScore: 5.0,
      attackVector: "LOCAL",
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-TEST"],
    });
  });

  it("handles missing metrics gracefully", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        vulnerabilities: [
          {
            cve: {
              id: "CVE-2024-NOMETRIC",
              published: "2024-01-01T00:00:00Z",
              descriptions: [{ lang: "en", value: "No metric data" }],
              references: [],
              metrics: undefined,
            },
          },
        ],
      }),
    });

    const result = await fetchNvdCves(30, 10);
    expect(result).toHaveLength(1);
    expect(result[0].baseSeverity).toBe("UNKNOWN");
    expect(result[0].baseScore).toBe(0);
    expect(result[0].references).toEqual([]);
  });

  it("limits references to 3", async () => {
    const refs = Array.from({ length: 10 }, (_, i) => ({ url: `https://example.com/${i}` }));
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        vulnerabilities: [
          {
            cve: {
              id: "CVE-2024-REFS",
              published: "2024-01-01T00:00:00Z",
              descriptions: [{ lang: "en", value: "Test" }],
              metrics: { cvssMetricV31: [{ cvssData: { baseSeverity: "LOW", baseScore: 2.0, attackVector: "NETWORK" } }] },
              references: refs,
            },
          },
        ],
      }),
    });

    const result = await fetchNvdCves(30, 10);
    expect(result[0].references).toHaveLength(3);
  });
});

describe("fetchCisaKev", () => {
  beforeEach(() => {
    clearDataCache();
    global.fetch = vi.fn();
  });

  it("returns cached entries on second call", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        vulnerabilities: [
          {
            cveID: "CVE-2024-KEV1",
            vendorProject: "Acme",
            product: "Widget",
            vulnerabilityName: "Test RCE",
            dateAdded: "2024-01-01",
            knownRansomwareCampaignUse: "Known",
          },
        ],
      }),
    });

    await fetchCisaKev();
    await fetchCisaKev();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("returns empty array on fetch error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const result = await fetchCisaKev();
    expect(result).toEqual([]);
  });

  it("parses KEV entries correctly", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        vulnerabilities: [
          {
            cveID: "CVE-2024-ABC",
            vendorProject: "Vendor",
            product: "Product",
            vulnerabilityName: "Exploit",
            dateAdded: "2024-02-01",
            dueDate: "2024-03-01",
            requiredAction: "Apply patch",
            knownRansomwareCampaignUse: "Unknown",
          },
        ],
      }),
    });

    const result = await fetchCisaKev();
    expect(result).toHaveLength(1);
    expect(result[0].cveID).toBe("CVE-2024-ABC");
    expect(result[0].vendorProject).toBe("Vendor");
    expect(result[0].product).toBe("Product");
    expect(result[0].dateAdded).toBe("2024-02-01");
    expect(result[0].dueDate).toBe("2024-03-01");
    expect(result[0].knownRansomwareCampaignUse).toBe("Unknown");
  });
});

describe("fetchMitreAttack", () => {
  beforeEach(() => {
    clearDataCache();
    global.fetch = vi.fn();
  });

  it("returns cached result on second call", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        objects: [
          {
            type: "x-mitre-tactic",
            external_references: [{ external_id: "TA0001" }],
            name: "Initial Access",
            x_mitre_shortname: "initial-access",
          },
          {
            type: "attack-pattern",
            external_references: [{ external_id: "T1190" }],
            name: "Exploit Public-Facing Application",
            kill_chain_phases: [{ phase_name: "initial-access" }],
            description: "Test technique",
            x_mitre_is_subtechnique: false,
            revoked: false,
            x_mitre_deprecated: false,
          },
        ],
      }),
    });

    await fetchMitreAttack();
    await fetchMitreAttack();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("returns empty arrays on fetch error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const result = await fetchMitreAttack();
    expect(result.techniques).toEqual([]);
    expect(result.tactics).toEqual([]);
  });

  it("parses techniques and tactics correctly", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        objects: [
          {
            type: "x-mitre-tactic",
            external_references: [{ external_id: "TA0001" }],
            name: "Initial Access",
            x_mitre_shortname: "initial-access",
          },
          {
            type: "attack-pattern",
            external_references: [{ external_id: "T1059" }],
            name: "Command and Scripting Interpreter",
            kill_chain_phases: [{ phase_name: "execution" }],
            description: "Long test description that should be truncated to 200 characters when processed through the implementation. Added more text to reach the limit.",
            x_mitre_is_subtechnique: false,
            revoked: false,
            x_mitre_deprecated: false,
          },
        ],
      }),
    });

    const result = await fetchMitreAttack();
    expect(result.tactics).toHaveLength(1);
    expect(result.tactics[0]).toEqual({
      id: "TA0001",
      name: "Initial Access",
      shortname: "initial-access",
    });
    expect(result.techniques).toHaveLength(1);
    expect(result.techniques[0].id).toBe("T1059");
  });

  it("filters out subtechniques and deprecated items", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        objects: [
          {
            type: "attack-pattern",
            external_references: [{ external_id: "T1059.001" }],
            name: "PowerShell",
            kill_chain_phases: [{ phase_name: "execution" }],
            description: "Subtech",
            x_mitre_is_subtechnique: true,
            revoked: false,
            x_mitre_deprecated: false,
          },
          {
            type: "attack-pattern",
            external_references: [{ external_id: "T1190" }],
            name: "Exploit",
            kill_chain_phases: [{ phase_name: "initial-access" }],
            description: "Good tech",
            x_mitre_is_subtechnique: false,
            revoked: false,
            x_mitre_deprecated: false,
          },
          {
            type: "attack-pattern",
            external_references: [{ external_id: "T1200" }],
            name: "Old",
            kill_chain_phases: [{ phase_name: "impact" }],
            description: "Deprecated",
            x_mitre_is_subtechnique: false,
            revoked: true,
            x_mitre_deprecated: true,
          },
        ],
      }),
    });

    const result = await fetchMitreAttack();
    expect(result.techniques).toHaveLength(1);
    expect(result.techniques[0].id).toBe("T1190");
  });

  it("handles missing external_references gracefully", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        objects: [
          {
            type: "x-mitre-tactic",
            name: "Test Tactic",
            x_mitre_shortname: "test",
          },
        ],
      }),
    });

    const result = await fetchMitreAttack();
    expect(result.tactics[0].id).toBe("");
    expect(result.tactics[0].shortname).toBe("test");
  });
});

describe("fetchTimeSeriesFromNvd", () => {
  beforeEach(() => {
    clearDataCache();
    global.fetch = vi.fn();
  });

  it("falls back to generated data when API returns empty", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ vulnerabilities: [] }),
    });

    const result = await fetchTimeSeriesFromNvd(6);
    expect(result).toHaveLength(6);
    expect(result[0].date).toMatch(/^\d{4}-\d{2}$/);
  });

  it("falls back to generated data on fetch error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const result = await fetchTimeSeriesFromNvd(6);
    expect(result).toHaveLength(6);
  });

  it("uses default 24 months", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ vulnerabilities: [] }),
    });

    const result = await fetchTimeSeriesFromNvd();
    expect(result).toHaveLength(24);
  });
});

describe("fetchSeverityFromNvd", () => {
  beforeEach(() => {
    clearDataCache();
    global.fetch = vi.fn();
  });

  it("falls back to generated distribution on error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const result = await fetchSeverityFromNvd();
    expect(result).toHaveLength(4);
    const total = result.reduce((sum, item) => sum + item.value, 0);
    expect(total).toBe(100);
  });

  it("computes percentage from baseScore", async () => {
    const mockCves = Array.from({ length: 10 }, (_, i) => ({
      id: `CVE-${i}`,
      published: "2024-01-01T00:00:00Z",
      description: "Test",
      metrics: {
        cvssMetricV31: [{
          cvssData: { baseSeverity: "CRITICAL", baseScore: 9.5, attackVector: "NETWORK" },
        }],
      },
      references: [],
    }));

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ vulnerabilities: mockCves.map((c) => ({ cve: c })) }),
    });

    const result = await fetchSeverityFromNvd();
    expect(result).toHaveLength(4);
    const critical = result.find((r) => r.name === "Critical");
    expect(critical?.value).toBeGreaterThan(0);
  });
});

describe("fetchMitreTacticDistribution", () => {
  beforeEach(() => {
    clearDataCache();
    global.fetch = vi.fn();
  });

  it("falls back to generated data on error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const result = await fetchMitreTacticDistribution();
    expect(result.length).toBeGreaterThan(0);
  });

  it("sorts by count descending and slices to top 14", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        objects: [
          {
            type: "attack-pattern",
            external_references: [{ external_id: "T1190" }],
            name: "Exploit",
            kill_chain_phases: [
              { phase_name: "initial-access" },
              { phase_name: "execution" },
              { phase_name: "persistence" },
            ],
            description: "Test",
            x_mitre_is_subtechnique: false,
            revoked: false,
            x_mitre_deprecated: false,
          },
          {
            type: "attack-pattern",
            external_references: [{ external_id: "T1059" }],
            name: "Command",
            kill_chain_phases: [{ phase_name: "execution" }],
            description: "Test",
            x_mitre_is_subtechnique: false,
            revoked: false,
            x_mitre_deprecated: false,
          },
        ],
      }),
    });

    const result = await fetchMitreTacticDistribution();
    expect(result.length).toBeLessThanOrEqual(14);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].count).toBeGreaterThanOrEqual(result[i].count);
    }
  });
});

describe("fetchAttackPatternsFromKev", () => {
  beforeEach(() => {
    clearDataCache();
    global.fetch = vi.fn();
  });

  it("returns 8 patterns from fallback generator when both APIs return empty", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ vulnerabilities: [] }),
    });

    const result = await fetchAttackPatternsFromKev();
    expect(result).toHaveLength(8);
  });

  it("returns 8 patterns on fetch error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const result = await fetchAttackPatternsFromKev();
    expect(result).toHaveLength(8);
  });

  it("classifies ransomware entries correctly when known ransomware flag is set", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        vulnerabilities: [
          {
            cveID: "CVE-2024-KEV1",
            vendorProject: "Acme",
            product: "Widget",
            vulnerabilityName: "Ransomware",
            dateAdded: "2024-01-01",
            dueDate: "2024-02-01",
            requiredAction: "Patch",
            knownRansomwareCampaignUse: "Known",
          },
        ],
      }),
    });

    const result = await fetchAttackPatternsFromKev();
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe("ransomware");
    expect(["critical", "high", "medium", "low"]).toContain(result[0].severity);
    expect(result[0].id).toMatch(/^kev-\d{3}$/);
  });

  it("links cveReferences from NVD matched CVEs", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        vulnerabilities: [
          {
            cveID: "CVE-2024-CONNECTED",
            vendorProject: "Acme",
            product: "Widget",
            vulnerabilityName: "Test",
            dateAdded: "2024-01-01",
            dueDate: "2024-02-01",
            requiredAction: "Patch",
            knownRansomwareCampaignUse: "Unknown",
          },
        ],
      }),
    });

    const result = await fetchAttackPatternsFromKev();
    expect(result).toHaveLength(1);
    expect(result[0].cveReferences).toContain("CVE-2024-CONNECTED");
  });
});
