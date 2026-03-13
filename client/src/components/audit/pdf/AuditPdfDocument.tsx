import { Document } from "@react-pdf/renderer";
import type { UnifiedAuditResult, ActionPlan } from "../types";
import { CoverPage } from "./CoverPage";
import { ExecutiveSummaryPage } from "./ExecutiveSummaryPage";
import { DimensionScorecardPage } from "./DimensionScorecardPage";
import { CriticalIssuesPage } from "./CriticalIssuesPage";
import { ActionPlanPage } from "./ActionPlanPage";
import { BusinessImpactPage } from "./BusinessImpactPage";
import { SecurityHealthPage } from "./SecurityHealthPage";
import { MethodologyPage } from "./MethodologyPage";

interface Props {
  result: UnifiedAuditResult;
  actionPlan: ActionPlan | null;
}

export function AuditPdfDocument({ result, actionPlan }: Props) {
  return (
    <Document
      title={`RescueAudit Report — ${result.meta.domain}`}
      author="RescueAudit"
      subject="Website Audit Report"
    >
      <CoverPage result={result} />
      {result.businessImpact && (
        <BusinessImpactPage impact={result.businessImpact} result={result} />
      )}
      <ExecutiveSummaryPage result={result} />
      <DimensionScorecardPage result={result} />
      <CriticalIssuesPage result={result} />
      <ActionPlanPage actionPlan={actionPlan} />
      <SecurityHealthPage findings={result.findings} />
      <MethodologyPage />
    </Document>
  );
}
