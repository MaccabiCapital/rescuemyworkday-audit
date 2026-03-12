import type { DimensionKey, PillarKey } from "./types";

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  technicalFoundation: "Technical Foundation",
  contentQuality: "Content Quality",
  schemaStructure: "Schema & Structure",
  aiEngineReadiness: "AI Engine Readiness",
  perfSecurity: "Performance & Security",
  trustAuthority: "Trust & Authority",
};

export const DIMENSION_ORDER: DimensionKey[] = [
  "technicalFoundation",
  "contentQuality",
  "schemaStructure",
  "aiEngineReadiness",
  "perfSecurity",
  "trustAuthority",
];

export const PILLAR_CONFIG: Record<
  PillarKey,
  { label: string; color: string; topDimensions: DimensionKey[] }
> = {
  seo: {
    label: "SEO",
    color: "#0057FF",
    topDimensions: ["technicalFoundation", "contentQuality", "perfSecurity"],
  },
  aio: {
    label: "AIO",
    color: "#8B5CF6",
    topDimensions: ["schemaStructure", "aiEngineReadiness", "contentQuality"],
  },
  geo: {
    label: "GEO",
    color: "#059669",
    topDimensions: ["aiEngineReadiness", "contentQuality", "trustAuthority"],
  },
};

// Dimensions appearing in more than one pillar's top 3
export const SHARED_DIMENSIONS: Set<DimensionKey> = (() => {
  const counts: Record<string, number> = {};
  for (const config of Object.values(PILLAR_CONFIG)) {
    for (const dim of config.topDimensions) {
      counts[dim] = (counts[dim] || 0) + 1;
    }
  }
  return new Set(
    Object.entries(counts)
      .filter(([, count]) => count > 1)
      .map(([dim]) => dim as DimensionKey),
  );
})();

export function getScoreColor(score: number): string {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#0057FF";
  if (score >= 40) return "#F59E0B";
  return "#EF4444";
}

export function getScoreBandLabel(band: string): string {
  switch (band) {
    case "ai-ready":
      return "AI-Ready";
    case "partially-visible":
      return "Partially Visible";
    case "needs-work":
      return "Needs Work";
    case "invisible":
      return "Invisible to AI";
    default:
      return band;
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical":
      return "#EF4444";
    case "high":
      return "#F97316";
    case "medium":
      return "#F59E0B";
    case "low":
      return "#3B82F6";
    default:
      return "#6B7280";
  }
}
