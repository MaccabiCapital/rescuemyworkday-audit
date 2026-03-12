import type { UnifiedAuditResult, PillarKey } from "./types";
import {
  PILLAR_CONFIG,
  DIMENSION_LABELS,
  SHARED_DIMENSIONS,
  getScoreColor,
} from "./constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link2 } from "lucide-react";

interface Props {
  result: UnifiedAuditResult;
}

const PILLAR_ORDER: PillarKey[] = ["seo", "aio", "geo"];

export function PillarCards({ result }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PILLAR_ORDER.map((pillar) => {
        const config = PILLAR_CONFIG[pillar];
        const pillarScore = result.score.pillars[pillar];
        const scoreColor = getScoreColor(pillarScore);

        return (
          <Card
            key={pillar}
            className="border"
            style={{ borderColor: `${config.color}25` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle
                  className="text-lg font-bold"
                  style={{
                    color: config.color,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {config.label}
                </CardTitle>
                <span
                  className="text-2xl font-bold"
                  style={{ color: scoreColor }}
                >
                  {pillarScore}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.topDimensions.map((dimKey) => {
                const dim = result.dimensions[dimKey];
                const isShared = SHARED_DIMENSIONS.has(dimKey);
                const dimColor = getScoreColor(dim.score);

                return (
                  <div key={dimKey} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-700 font-medium">
                          {DIMENSION_LABELS[dimKey]}
                        </span>
                        {isShared && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-400 bg-gray-100 rounded-full px-1.5 py-0.5 cursor-help">
                                  <Link2 className="w-2.5 h-2.5" />
                                  shared
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-48">
                                  This dimension contributes to multiple pillars
                                  with different weights
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <span
                        className="font-semibold text-sm"
                        style={{ color: dimColor }}
                      >
                        {dim.score}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${dim.score}%`,
                          backgroundColor: dimColor,
                        }}
                      />
                    </div>

                    {/* Finding counts */}
                    <div className="flex gap-3 text-[11px]">
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
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
