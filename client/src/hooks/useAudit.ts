import { useState, useCallback, useRef } from "react";
import type { UnifiedAuditResult } from "../components/audit/types";

export type AuditState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "polling"; auditId: string; pollCount: number; progress?: string }
  | { status: "complete"; result: UnifiedAuditResult }
  | { status: "error"; message: string };

const MAX_POLLS = 50;
const POLL_INTERVAL = 3000;

export function useAudit() {
  const [state, setState] = useState<AuditState>({ status: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const submit = useCallback(async (url: string) => {
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    setState({ status: "submitting" });

    try {
      // Step 1: Start audit
      const resp = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: abort.signal,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Failed to start audit" }));
        setState({ status: "error", message: err.error || "Failed to start audit" });
        return;
      }

      const { auditId } = await resp.json();
      setState({ status: "polling", auditId, pollCount: 0 });

      // Step 2: Poll for results
      for (let i = 0; i < MAX_POLLS; i++) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL));
        if (abort.signal.aborted) return;

        const pollResp = await fetch(`/api/audit/${auditId}`, {
          signal: abort.signal,
        });
        const data = await pollResp.json();

        if (data.status === "complete") {
          setState({ status: "complete", result: data.result });
          return;
        }

        if (data.status === "error") {
          setState({
            status: "error",
            message: data.error || "Audit failed",
          });
          return;
        }

        // Still running — update progress
        const progressStr = typeof data.progress === "string" ? data.progress : undefined;
        setState({ status: "polling", auditId, pollCount: i + 1, progress: progressStr });
      }

      // Timed out
      setState({ status: "error", message: "Audit timed out — please try again" });
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setState({ status: "error", message: err.message || "Network error" });
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ status: "idle" });
  }, []);

  return { state, submit, reset };
}
