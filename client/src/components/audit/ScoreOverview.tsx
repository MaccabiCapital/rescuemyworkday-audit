import type { UnifiedAuditResult, PillarKey } from "./types";
import { getScoreColor, getScoreBandLabel, PILLAR_CONFIG } from "./constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Loader2,
  TrendingUp,
  TrendingDown,
  Clock,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

const PILLAR_WEIGHTS: Record<PillarKey, number> = {
  seo: 0.40,
  aio: 0.30,
  geo: 0.30,
};

const PILLAR_FULL_LABELS: Record<PillarKey, string> = {
  seo: "Search Engine Optimization",
  aio: "AI Optimization",
  geo: "Generative Engine Optimization",
};

const PILLAR_ORDER: PillarKey[] = ["seo", "aio", "geo"];

interface Props {
  result: UnifiedAuditResult;
  pdfUrl: string | null;
  pdfLoading: boolean;
  onDownloadPdf: () => void;
}

export function ScoreOverview({ result, pdfUrl, pdfLoading, onDownloadPdf }: Props) {
  const { score, meta } = result;
  const scoreColor = getScoreColor(score.overall);
  const bandLabel = getScoreBandLabel(score.band);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score.overall / 100) * circumference;

  return (
    <div className="space-y-4">
      {/* Header: URL, timestamp, PDF placeholder */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Globe className="w-4 h-4" />
          <span className="font-medium text-gray-700">{meta.domain}</span>
          <span className="text-gray-300">|</span>
          <span className="text-xs truncate max-w-xs">{meta.url}</span>
          <span className="text-gray-300">|</span>
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">
            {new Date(meta.auditedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
{pdfUrl ? (
          <a
            href={pdfUrl}
            download={`rescueaudit-${meta.domain}-${new Date(meta.auditedAt).toISOString().slice(0, 10)}.pdf`}
          >
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
          </a>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled={pdfLoading}
            onClick={onDownloadPdf}
          >
            {pdfLoading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-1" />
            )}
            PDF
          </Button>
        )}
      </div>

      {/* Score gauge + pillar bars */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Left: gauge + badge */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="8"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-3xl font-bold"
                style={{ color: scoreColor, fontFamily: "var(--font-display)" }}
              >
                {score.overall}
              </span>
              <span className="text-xs text-gray-400">/ 100</span>
            </div>
          </div>

          <div className="space-y-2 md:hidden">
            <Badge
              className="text-sm px-3 py-1"
              style={{
                backgroundColor: `${scoreColor}15`,
                color: scoreColor,
                border: `1px solid ${scoreColor}30`,
              }}
            >
              {bandLabel}
            </Badge>
            {score.previousAudit && (
              <div className="flex items-center gap-2 text-sm">
                {score.previousAudit.delta > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-medium">
                      +{score.previousAudit.delta} pts
                    </span>
                  </>
                ) : score.previousAudit.delta < 0 ? (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 font-medium">
                      {score.previousAudit.delta} pts
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">No change</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: pillar contribution bars */}
        <div className="flex-1 w-full space-y-3 border rounded-lg p-4 bg-gray-50/50">
          {PILLAR_ORDER.map((pillar) => {
            const pillarScore = score.pillars[pillar];
            const weight = PILLAR_WEIGHTS[pillar];
            const contribution = Math.round(pillarScore * weight);
            const maxContribution = Math.round(100 * weight);
            const pct = (pillarScore / 100) * 100;
            const config = PILLAR_CONFIG[pillar];

            return (
              <div key={pillar} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${config.color}15`,
                        color: config.color,
                      }}
                    >
                      {config.label}
                    </span>
                    <span className="text-sm text-gray-600">
                      {PILLAR_FULL_LABELS[pillar]}
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: getScoreColor(pillarScore) }}
                  >
                    {contribution}/{maxContribution}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: config.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                  />
                </div>
              </div>
            );
          })}

          {/* Badge + change below bars on desktop */}
          <div className="hidden md:flex items-center gap-3 pt-1">
            <Badge
              className="text-sm px-3 py-1"
              style={{
                backgroundColor: `${scoreColor}15`,
                color: scoreColor,
                border: `1px solid ${scoreColor}30`,
              }}
            >
              {bandLabel}
            </Badge>
            {score.previousAudit && (
              <div className="flex items-center gap-2 text-sm">
                {score.previousAudit.delta > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-medium">
                      +{score.previousAudit.delta} pts
                    </span>
                  </>
                ) : score.previousAudit.delta < 0 ? (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 font-medium">
                      {score.previousAudit.delta} pts
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">No change</span>
                )}
                <span className="text-gray-400 text-xs">
                  since{" "}
                  {new Date(score.previousAudit.auditedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
