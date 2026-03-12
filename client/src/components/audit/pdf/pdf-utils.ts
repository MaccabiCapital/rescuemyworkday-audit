import type { DimensionKey, PillarKey, ScoreBand } from "../types";

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

export const PILLAR_LABELS: Record<PillarKey, string> = {
  seo: "SEO",
  aio: "AIO",
  geo: "GEO",
};

export const PILLAR_COLORS: Record<PillarKey, string> = {
  seo: "#0057FF",
  aio: "#8B5CF6",
  geo: "#059669",
};

export function getScoreColor(score: number): string {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#0057FF";
  if (score >= 40) return "#F59E0B";
  return "#EF4444";
}

export function getScoreBandLabel(band: ScoreBand): string {
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

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
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
