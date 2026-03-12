import { useState, useCallback } from "react";
import type { UnifiedAuditResult, ActionPlan } from "./types";
import { ScoreOverview } from "./ScoreOverview";
import { PillarCards } from "./PillarCards";
import { DimensionBreakdown } from "./DimensionBreakdown";
import { FindingsList } from "./FindingsList";
import { SecurityFindings } from "./SecurityFindings";
import { IntelligenceInsights } from "./IntelligenceInsights";
import { ActionPlanSection } from "./ActionPlanSection";
import { motion } from "framer-motion";
import { BarChart3, Wrench } from "lucide-react";

interface Props {
  result: UnifiedAuditResult;
}

type ViewTab = "audit" | "action-plan";

export default function AuditResultsV2({ result }: Props) {
  const [activeTab, setActiveTab] = useState<ViewTab>("audit");
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleDownloadPdf = useCallback(async () => {
    setPdfLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { AuditPdfDocument } = await import("./pdf/AuditPdfDocument");
      const blob = await pdf(
        <AuditPdfDocument result={result} actionPlan={actionPlan} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      // Auto-trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `rescueaudit-${result.meta.domain}-${new Date(result.meta.auditedAt).toISOString().slice(0, 10)}.pdf`;
      a.click();
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setPdfLoading(false);
    }
  }, [result, actionPlan]);

  return (
    <section id="audit-results" className="py-12 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Tab bar */}
          <div className="flex gap-1 mb-8 border-b border-gray-200">
            <button
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "audit"
                  ? "border-[#0057FF] text-[#0057FF]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("audit")}
            >
              <BarChart3 className="w-4 h-4" />
              Audit Results
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "action-plan"
                  ? "border-[#0057FF] text-[#0057FF]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("action-plan")}
            >
              <Wrench className="w-4 h-4" />
              Action Plan
              {actionPlan && (
                <span className="ml-1 text-[10px] bg-green-100 text-green-700 rounded-full px-1.5">
                  ready
                </span>
              )}
            </button>
          </div>

          {/* Main audit view */}
          {activeTab === "audit" && (
            <div className="space-y-10">
              <ScoreOverview
                result={result}
                pdfUrl={pdfUrl}
                pdfLoading={pdfLoading}
                onDownloadPdf={handleDownloadPdf}
              />
              <PillarCards result={result} />
              <DimensionBreakdown result={result} />
              <FindingsList findings={result.findings} />
              <SecurityFindings findings={result.findings} />
              <IntelligenceInsights intelligence={result.intelligence} />
            </div>
          )}

          {/* Action plan (lazy-loaded on tab click) */}
          {activeTab === "action-plan" && (
            <ActionPlanSection
              result={result}
              actionPlan={actionPlan}
              onPlanGenerated={setActionPlan}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
