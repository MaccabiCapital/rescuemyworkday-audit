import { useState } from "react";
import type {
  UnifiedAuditResult,
  DimensionKey,
  Finding,
  FindingStatus,
} from "./types";
import {
  DIMENSION_LABELS,
  DIMENSION_ORDER,
  getScoreColor,
  getSeverityColor,
} from "./constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  ChevronDown,
} from "lucide-react";

interface Props {
  result: UnifiedAuditResult;
}

type FilterValue = "all" | "pass" | "warn" | "fail";

export function DimensionBreakdown({ result }: Props) {
  const [filters, setFilters] = useState<Record<DimensionKey, FilterValue>>(
    () =>
      Object.fromEntries(
        DIMENSION_ORDER.map((d) => [d, "all"]),
      ) as Record<DimensionKey, FilterValue>,
  );

  const setFilter = (dim: DimensionKey, value: FilterValue) => {
    setFilters((prev) => ({ ...prev, [dim]: value }));
  };

  return (
    <div>
      <h3
        className="text-lg font-bold mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Dimension Breakdown
      </h3>
      <Accordion type="multiple" className="space-y-2">
        {DIMENSION_ORDER.map((dimKey) => {
          const dim = result.dimensions[dimKey];
          const dimFindings = result.findings.filter(
            (f) => f.dimension === dimKey,
          );
          const filter = filters[dimKey];
          const filtered =
            filter === "all"
              ? dimFindings
              : dimFindings.filter((f) => f.status === filter);

          return (
            <AccordionItem
              key={dimKey}
              value={dimKey}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-4 w-full pr-4">
                  <span className="font-medium text-gray-900 text-left">
                    {DIMENSION_LABELS[dimKey]}
                  </span>
                  <div className="flex-1" />
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-green-600">
                      {dim.findingsCount.pass} pass
                    </span>
                    <span className="text-amber-500">
                      {dim.findingsCount.warn} warn
                    </span>
                    <span className="text-red-500">
                      {dim.findingsCount.fail} fail
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold min-w-[2.5rem] text-right"
                    style={{ color: getScoreColor(dim.score) }}
                  >
                    {dim.score}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {/* Status filter toggles */}
                <div className="flex gap-1.5 mb-3 pb-3 border-b">
                  {(["all", "pass", "warn", "fail"] as const).map((s) => {
                    const count =
                      s === "all"
                        ? dimFindings.length
                        : dimFindings.filter((f) => f.status === s).length;
                    return (
                      <button
                        key={s}
                        className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                          filter === s
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        onClick={() => setFilter(dimKey, s)}
                      >
                        {s === "all" ? "All" : s} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Findings */}
                <div className="space-y-2">
                  {filtered.map((finding) => (
                    <FindingItem key={finding.checkId} finding={finding} />
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-sm text-gray-400 py-2">
                      No findings match this filter.
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pass: <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />,
  fail: <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />,
  warn: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
  info: <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />,
  skip: <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />,
};

function FindingItem({ finding }: { finding: Finding }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-md p-3 text-sm">
      <div className="flex items-start gap-2">
        <div className="mt-0.5">
          {STATUS_ICONS[finding.status] || STATUS_ICONS.info}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900">{finding.name}</span>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0"
              style={{
                color: getSeverityColor(finding.severity),
                borderColor: getSeverityColor(finding.severity),
              }}
            >
              {finding.severity}
            </Badge>
            {!finding.affectsScore && (
              <span className="text-[10px] text-gray-400 italic">
                info only
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-1">{finding.detail}</p>

          {/* Evidence */}
          {(finding.evidence.value != null ||
            finding.evidence.expected != null) && (
            <div className="mt-1.5 text-xs text-gray-500 flex gap-3 flex-wrap">
              {finding.evidence.value != null && (
                <span>
                  Value:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    {String(finding.evidence.value)}
                  </code>
                </span>
              )}
              {finding.evidence.expected != null && (
                <span>
                  Expected:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    {String(finding.evidence.expected)}
                  </code>
                </span>
              )}
            </div>
          )}

          {/* Recommendation (collapsible) */}
          {finding.recommendation && (
            <>
              <button
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                onClick={() => setExpanded(!expanded)}
              >
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`}
                />
                {expanded ? "Hide" : "Show"} recommendation
              </button>
              {expanded && (
                <p className="mt-1.5 text-xs text-gray-600 bg-blue-50 rounded p-2">
                  {finding.recommendation}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
