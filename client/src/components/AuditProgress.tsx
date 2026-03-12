import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  status: "submitting" | "polling";
  progress?: string;
  error?: string;
  onRetry?: () => void;
}

const STEPS = [
  "Submitting audit request...",
  "Running SEO analysis...",
  "Running AI readiness checks...",
  "Generating scores...",
  "Audit complete!",
];

export function AuditProgress({ status, progress, error, onRetry }: Props) {
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

  const currentStep =
    status === "submitting"
      ? 0
      : progress?.toLowerCase().includes("seo")
        ? 1
        : progress?.toLowerCase().includes("ai")
          ? 2
          : progress?.toLowerCase().includes("scor")
            ? 3
            : 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-6" />
      <div className="space-y-2 text-center">
        {STEPS.slice(0, currentStep + 1).map((step, i) => (
          <p
            key={step}
            className={`text-sm ${i === currentStep ? "text-gray-900 font-medium" : "text-gray-400"}`}
          >
            {step}
          </p>
        ))}
      </div>
      {progress && (
        <p className="mt-4 text-xs text-gray-400">{progress}</p>
      )}
    </div>
  );
}
