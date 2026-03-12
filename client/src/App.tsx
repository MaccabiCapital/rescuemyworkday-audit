import { lazy, Suspense, Component, type ReactNode } from "react";
import { HeroInput } from "./components/HeroInput";
import { AuditProgress } from "./components/AuditProgress";
import { useAudit } from "./hooks/useAudit";
import { Loader2, AlertTriangle } from "lucide-react";

const AuditResultsV2 = lazy(
  () => import("./components/audit/AuditResultsV2"),
);

class ErrorBoundary extends Component<
  { children: ReactNode; onReset: () => void },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-4 text-sm max-w-md text-center">
            {this.state.error.message}
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            onClick={() => {
              this.setState({ error: null });
              this.props.onReset();
            }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary onReset={reset}>
      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        }
      >
        <AuditResultsV2 result={state.result} />
      </Suspense>
    </ErrorBoundary>
  );
}
