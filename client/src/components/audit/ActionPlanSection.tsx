import { useState, useEffect, useCallback, useRef } from "react";
import type { UnifiedAuditResult, ActionPlan, ActionPlanItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertCircle,
  Zap,
  ChevronDown,
} from "lucide-react";

const PLAN_STEPS = [
  { label: "Analyzing audit findings...", target: 15 },
  { label: "Identifying critical issues...", target: 35 },
  { label: "Prioritizing actions by impact...", target: 55 },
  { label: "Building fix recommendations...", target: 75 },
  { label: "Finalizing your action plan...", target: 90 },
];

interface Props {
  result: UnifiedAuditResult;
  actionPlan: ActionPlan | null;
  onPlanGenerated: (plan: ActionPlan) => void;
}

export function ActionPlanSection({
  result,
  actionPlan,
  onPlanGenerated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const generatePlan = useCallback(async () => {
    setLoading(true);
    setError("");
    setProgress(0);
    setStepIndex(0);

    // Animate progress through steps
    let currentStep = 0;
    let currentProgress = 0;
    progressTimer.current = setInterval(() => {
      const step = PLAN_STEPS[currentStep];
      if (!step) return;
      if (currentProgress < step.target) {
        currentProgress += 1;
        setProgress(currentProgress);
      } else if (currentStep < PLAN_STEPS.length - 1) {
        currentStep++;
        setStepIndex(currentStep);
      }
    }, 200);

    try {
      const categories = result.raw?.rescue?.categories;
      if (!categories || categories.length === 0) {
        throw new Error("No audit category data available for action plan generation");
      }

      const response = await fetch("/api/action-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: result.meta.url,
          domain: result.meta.domain,
          overallScore: result.score.overall,
          categories,
        }),
      });

      if (!response.ok) {
        const err = await response
          .json()
          .catch(() => ({ error: "Failed to generate plan" }));
        throw new Error(err.error || "Failed to generate plan");
      }

      const data = await response.json();

      const enrichedItems = data.items.map((item: ActionPlanItem) => {
        const impact =
          item.priority === "critical"
            ? 5
            : item.priority === "high"
              ? 4
              : item.priority === "medium"
                ? 3
                : 2;
        const difficulty = item.estimatedTime?.includes("min")
          ? 1
          : item.estimatedTime?.includes("hour")
            ? 3
            : 2;

        return {
          ...item,
          impactScore: item.impactScore || impact,
          difficultyScore: item.difficultyScore || difficulty,
          isQuickWin:
            (item.impactScore || impact) >= 4 &&
            (item.difficultyScore || difficulty) <= 2,
        };
      });

      onPlanGenerated({ ...data, items: enrichedItems });
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (progressTimer.current) clearInterval(progressTimer.current);
      setProgress(100);
      setTimeout(() => setLoading(false), 300);
    }
  }, [result, onPlanGenerated]);

  // Auto-generate plan on mount (no gate)
  useEffect(() => {
    if (!actionPlan) {
      generatePlan();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Loading state with progress bar
  if (loading) {
    const step = PLAN_STEPS[stepIndex] || PLAN_STEPS[PLAN_STEPS.length - 1];
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#0057FF] mb-4" />
        <p className="text-sm font-medium text-gray-700 mb-2">
          {step.label}
        </p>
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className="bg-[#0057FF] h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400">{progress}%</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={generatePlan}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!actionPlan) {
    return null;
  }

  // Render the plan
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">{actionPlan.summary}</p>
      </div>

      {/* Quick wins */}
      {actionPlan.items.some((i) => i.isQuickWin) && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-sm">Quick Wins</h4>
          </div>
          <div className="space-y-2">
            {actionPlan.items
              .filter((i) => i.isQuickWin)
              .map((item, idx) => (
                <ActionItem key={`qw-${idx}`} item={item} />
              ))}
          </div>
        </div>
      )}

      {/* All items */}
      <div>
        <h4 className="font-bold text-sm mb-3">All Actions</h4>
        <div className="space-y-2">
          {actionPlan.items.map((item, idx) => (
            <ActionItem key={`ai-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionItem({ item }: { item: ActionPlanItem }) {
  const [expanded, setExpanded] = useState(false);

  const priorityColor =
    item.priority === "critical"
      ? "#EF4444"
      : item.priority === "high"
        ? "#F97316"
        : item.priority === "medium"
          ? "#F59E0B"
          : "#3B82F6";

  return (
    <div className="border rounded-lg p-3 text-sm">
      <div className="flex items-start gap-2">
        <div
          className="w-1 self-stretch rounded-full flex-shrink-0"
          style={{ backgroundColor: priorityColor }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900">
              {item.signalName}
            </span>
            <Badge
              className="text-[10px] px-1.5 py-0 capitalize"
              style={{
                backgroundColor: `${priorityColor}15`,
                color: priorityColor,
              }}
            >
              {item.priority}
            </Badge>
            {item.isQuickWin && (
              <Badge className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700">
                Quick Win
              </Badge>
            )}
            {item.estimatedTime && (
              <span className="text-xs text-gray-400">
                {item.estimatedTime}
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-1">{item.whatIsWrong}</p>

          <button
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronDown
              className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
            {expanded ? "Hide" : "Show"} fix details
          </button>

          {expanded && (
            <div className="mt-2 space-y-2">
              <div className="bg-green-50 rounded p-2">
                <p className="text-xs font-medium text-green-800 mb-1">
                  How to fix:
                </p>
                <p className="text-xs text-green-700">{item.howToFix}</p>
              </div>
              {item.codeExample && (
                <pre className="bg-gray-900 text-green-400 text-xs rounded p-3 overflow-x-auto">
                  <code>{item.codeExample}</code>
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
