import type { IntelligenceFinding } from "./types";
import { Badge } from "@/components/ui/badge";
import { getSeverityColor } from "./constants";
import { Brain, Sparkles } from "lucide-react";

interface Props {
  intelligence: IntelligenceFinding[];
}

export function IntelligenceInsights({ intelligence }: Props) {
  const hasData = intelligence && intelligence.length > 0;

  return (
    <div className="border border-gray-200 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-600" />
        <h3
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Intelligence Insights
        </h3>
      </div>

      {hasData ? (
        <div className="space-y-3">
          {intelligence.map((item) => (
            <div key={item.checkId} className="border rounded-md p-3 text-sm">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-medium text-gray-900">{item.name}</span>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 capitalize"
                  style={{
                    color: getSeverityColor(item.severity),
                    borderColor: getSeverityColor(item.severity),
                  }}
                >
                  {item.severity}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 text-purple-600 border-purple-200"
                >
                  {item.type}
                </Badge>
              </div>
              <p className="text-gray-600">{item.summary}</p>
              {item.affectedUrls.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Affected:{" "}
                  {item.affectedUrls.slice(0, 3).join(", ")}
                  {item.affectedUrls.length > 3 &&
                    ` +${item.affectedUrls.length - 3} more`}
                </div>
              )}
              {item.recommendation && (
                <p className="text-xs text-blue-600 mt-2 bg-blue-50 rounded p-2">
                  {item.recommendation}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">Coming Soon</p>
          <p className="text-xs mt-1">
            Cross-page schema consistency, keyword cannibalization, and more
          </p>
        </div>
      )}
    </div>
  );
}
