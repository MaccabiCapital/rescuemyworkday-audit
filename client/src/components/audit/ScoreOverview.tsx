import type { UnifiedAuditResult } from "./types";
import { getScoreColor, getScoreBandLabel } from "./constants";
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

      {/* Score gauge + band + change */}
      <div className="flex items-center gap-8">
        {/* Animated circular gauge */}
        <div className="relative w-32 h-32 flex-shrink-0">
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
            <span className="text-xs text-gray-400">/100</span>
          </div>
        </div>

        <div className="space-y-2">
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

          {/* Score change banner */}
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

          {/* Pillar scores inline */}
          <div className="flex gap-4 text-xs text-gray-500 pt-1">
            <span>
              SEO{" "}
              <strong className="text-gray-900">{score.pillars.seo}</strong>
            </span>
            <span>
              AIO{" "}
              <strong className="text-gray-900">{score.pillars.aio}</strong>
            </span>
            <span>
              GEO{" "}
              <strong className="text-gray-900">{score.pillars.geo}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
