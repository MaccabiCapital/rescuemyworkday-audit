/**
 * Types for the v2 audit UI.
 * Copied from audit-worker/src/types/unified.ts — no runtime dependency.
 */

export type ScoreBand = "ai-ready" | "partially-visible" | "needs-work" | "invisible";
export type EngineSource = "seomator" | "rescue" | "native";
export type FindingStatus = "pass" | "fail" | "warn" | "info" | "skip";
export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type DimensionKey =
  | "technicalFoundation"
  | "contentQuality"
  | "schemaStructure"
  | "aiEngineReadiness"
  | "perfSecurity"
  | "trustAuthority";
export type PillarKey = "seo" | "aio" | "geo";
export type IntelligenceType =
  | "cannibalization"
  | "schema-consistency"
  | "schema-drift"
  | "citability"
  | "brand-signal"
  | "index-bloat"
  | "topical-gap"
  | "answer-box"
  | "knowledge-panel"
  | "indexnow";

export interface UnifiedAuditResult {
  meta: AuditMeta;
  score: AuditScore;
  dimensions: Record<DimensionKey, DimensionScore>;
  findings: Finding[];
  intelligence: IntelligenceFinding[];
  criticalIssues: CriticalIssue[];
  actionPlan: null;
  executiveSummary: null;
  contentAnalysis: ContentAnalysis;
  businessImpact: BusinessImpact | null;
  raw: RawEngineOutputs;
}

export interface AuditMeta {
  auditId: string;
  url: string;
  finalUrl: string;
  domain: string;
  auditedAt: string;
  engineVersions: {
    seomator: string;
    rescue: string;
    nativePort: string;
  };
  auditDuration: number;
  pagesAudited: number;
}

export interface AuditScore {
  overall: number;
  band: ScoreBand;
  pillars: Record<PillarKey, number>;
  previousAudit: {
    overall: number;
    pillars: Record<PillarKey, number>;
    auditedAt: string;
    delta: number;
  } | null;
}

export interface DimensionScore {
  score: number;
  findingsCount: {
    pass: number;
    warn: number;
    fail: number;
    info: number;
  };
  topIssues: Finding[];
  pillarContributions: Record<PillarKey, number>;
}

export interface Finding {
  checkId: string;
  name: string;
  engine: EngineSource;
  dimension: DimensionKey;
  status: FindingStatus;
  severity: Severity;
  detail: string;
  recommendation: string | null;
  evidence: {
    value: string | number | null;
    expected: string | number | null;
    url: string | null;
    snippet: string | null;
  };
  affectsScore: boolean;
}

export interface IntelligenceFinding {
  checkId: string;
  name: string;
  type: IntelligenceType;
  severity: Severity;
  summary: string;
  detail: string;
  affectedUrls: string[];
  data: Record<string, unknown>;
  recommendation: string;
}

export interface CriticalIssue {
  rank: number;
  finding: Finding;
  estimatedScoreImpact: number;
  dimension: DimensionKey;
  pillarImpact: Record<PillarKey, number>;
}

export interface KeywordEntry {
  keyword: string;
  count: number;
  density: number;
  isStuffed: boolean;
}

export interface AiReadabilityCriterion {
  name: string;
  score: number;
  maxScore: number;
  detail: string;
  fix: string | null;
}

export interface ContentAnalysis {
  keywords: {
    topKeywords: KeywordEntry[];
    unigrams: KeywordEntry[];
    bigrams: KeywordEntry[];
    trigrams: KeywordEntry[];
    totalWords: number;
  };
  placement: {
    primaryKeyword: string;
    inH1: boolean;
    inTitle: boolean;
    inMetaDescription: boolean;
    inFirst100Words: boolean;
    inAltTags: boolean;
    inH2s: boolean;
  } | null;
  readability: {
    fleschKincaid: number;
    gradeLevel: string;
    avgSentenceLength: number;
    avgSyllablesPerWord: number;
  };
  aiReadability: {
    overallScore: number;
    criteria: AiReadabilityCriterion[];
  };
}

export interface RawEngineOutputs {
  seomator: unknown;
  rescue: RescueEngineResult;
  nativePort: NativePortResult;
}

export interface RescueSignal {
  name: string;
  status: "pass" | "fail" | "warning" | "unknown";
  points: number;
  maxPoints: number;
  detail: string;
  recommendation?: string;
}

export interface RescueCategory {
  name: string;
  signals: RescueSignal[];
  maxPoints: number;
  score: number;
}

export interface RescueEngineResult {
  categories: RescueCategory[];
  totalScore: number;
  maxScore: number;
  contentAnalysis: ContentAnalysis | null;
}

export interface NativePortCheck {
  checkId: string;
  name: string;
  type: IntelligenceType;
  status: FindingStatus;
  severity: Severity;
  detail: string;
  recommendation: string;
  data: Record<string, unknown>;
  affectedUrls: string[];
}

export interface NativePortResult {
  checks: NativePortCheck[];
}

export interface MissedKeyword {
  keyword: string;
  position: number;
  searchVolume: number;
  missedClicks: number;
}

export interface BusinessImpactAssumptions {
  industry: string;
  conversionRate: number;
  conversionRationale: string;
}

export interface BusinessImpact {
  missedVisitors: number;
  missedSales: number;
  topMissedKeywords: MissedKeyword[];
  assumptions: BusinessImpactAssumptions;
}

export interface ActionPlanItem {
  signalName: string;
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  whatIsWrong: string;
  howToFix: string;
  codeExample?: string;
  estimatedTime: string;
  impactScore?: number;
  difficultyScore?: number;
  isQuickWin?: boolean;
  scoreImpact?: number;
  businessBenefit?: string;
}

export interface ActionPlan {
  items: ActionPlanItem[];
  summary: string;
}
