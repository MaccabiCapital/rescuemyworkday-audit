import { AlertCircle, RefreshCw, Check, Globe, Search, Bot, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  status: "submitting" | "polling";
  pollCount?: number;
  progress?: string;
  error?: string;
  onRetry?: () => void;
}

const STAGES = [
  { label: "Connecting to audit engine", icon: Globe, pollRange: [0, 0] },
  { label: "Crawling website & analyzing SEO", icon: Search, pollRange: [1, 8] },
  { label: "Running AI readiness checks", icon: Bot, pollRange: [9, 18] },
  { label: "Calculating scores & generating report", icon: BarChart3, pollRange: [19, 60] },
] as const;

function getStageIndex(status: string, pollCount: number): number {
  if (status === "submitting") return 0;
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (pollCount >= STAGES[i].pollRange[0]) return i;
  }
  return 0;
}

function getProgressPercent(status: string, pollCount: number): number {
  if (status === "submitting") return 5;
  // Asymptotic progress: fast at first, slows down, never reaches 100
  // Typical audit takes ~20 polls (60s), show ~85% by then
  const elapsed = pollCount * 3; // seconds
  return Math.min(95, 5 + 90 * (1 - Math.exp(-elapsed / 50)));
}

export function AuditProgress({ status, pollCount = 0, progress, error, onRetry }: Props) {
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-4 text-center max-w-md">{error}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  const currentStage = getStageIndex(status, pollCount);
  const percent = getProgressPercent(status, pollCount);
  const elapsed = status === "submitting" ? 0 : pollCount * 3;
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Title */}
        <div className="text-center">
          <h2
            className="text-2xl font-bold tracking-tight mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Analyzing your website
          </h2>
          <p className="text-sm text-gray-500">
            This usually takes 30-90 seconds
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{Math.round(percent)}%</span>
            <span>{timeStr} elapsed</span>
          </div>
        </div>

        {/* Stage checklist */}
        <div className="space-y-3">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const isDone = i < currentStage;
            const isActive = i === currentStage;

            return (
              <div
                key={stage.label}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 border border-blue-200"
                    : isDone
                      ? "bg-gray-50"
                      : "opacity-40"
                }`}
              >
                {isDone ? (
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                ) : isActive ? (
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                )}
                <span
                  className={`text-sm ${
                    isActive
                      ? "text-blue-700 font-medium"
                      : isDone
                        ? "text-gray-500"
                        : "text-gray-400"
                  }`}
                >
                  {stage.label}
                  {isDone && <span className="text-green-600 ml-1">&check;</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
