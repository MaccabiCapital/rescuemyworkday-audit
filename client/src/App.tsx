import { lazy, Suspense } from "react";
import { HeroInput } from "./components/HeroInput";
import { AuditProgress } from "./components/AuditProgress";
import { useAudit } from "./hooks/useAudit";
import { Loader2 } from "lucide-react";

const AuditResultsV2 = lazy(
  () => import("./components/audit/AuditResultsV2"),
);

export default function App() {
  const { state, submit, reset } = useAudit();

  // Idle — show URL input
  if (state.status === "idle") {
    return <HeroInput onSubmit={submit} />;
  }

  // Submitting or polling — show progress
  if (state.status === "submitting" || state.status === "polling") {
    return (
      <AuditProgress
        status={state.status}
        progress={state.status === "polling" ? state.progress : undefined}
      />
    );
  }

  // Error — show error with retry
  if (state.status === "error") {
    return (
      <AuditProgress
        status="submitting"
        error={state.message}
        onRetry={reset}
      />
    );
  }

  // Complete — show results
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <AuditResultsV2 result={state.result} />
    </Suspense>
  );
}
