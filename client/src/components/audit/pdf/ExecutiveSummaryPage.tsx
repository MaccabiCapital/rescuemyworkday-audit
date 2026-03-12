import { Page, View, Text } from "@react-pdf/renderer";
import type { UnifiedAuditResult } from "../types";
import { styles } from "./pdf-styles";

interface Props {
  result: UnifiedAuditResult;
}

const PLACEHOLDER_PARAGRAPHS = [
  "This audit evaluated your website across six key dimensions that determine how well your content is discovered, understood, and recommended by both traditional search engines and AI-powered platforms.",
  "The results reflect your site's current standing in technical SEO foundations, content quality, structured data implementation, AI engine readiness, performance and security, and trust and authority signals. Each dimension contributes to three pillar scores: SEO (traditional search), AIO (AI optimization), and GEO (generative engine optimization).",
  "Review the critical issues and action plan sections for prioritized, actionable recommendations that will have the greatest impact on your overall visibility score. Focus on quick wins first to build momentum, then address structural improvements for long-term gains.",
];

export function ExecutiveSummaryPage({ result }: Props) {
  const paragraphs = result.executiveSummary
    ? (result.executiveSummary as string).split("\n\n").filter(Boolean)
    : PLACEHOLDER_PARAGRAPHS;

  const { score, findings } = result;
  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const highCount = findings.filter((f) => f.severity === "high").length;
  const passCount = findings.filter((f) => f.status === "pass").length;
  const totalScored = findings.filter((f) => f.affectsScore).length;

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Executive Summary</Text>

      {paragraphs.map((p, i) => (
        <Text key={i} style={styles.bodyText}>
          {p}
        </Text>
      ))}

      {/* Key stats row */}
      <View
        style={{
          flexDirection: "row",
          gap: 16,
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        <StatBox label="Overall Score" value={`${score.overall}/100`} />
        <StatBox label="Critical Issues" value={String(criticalCount)} />
        <StatBox label="High Priority" value={String(highCount)} />
        <StatBox label="Checks Passed" value={`${passCount}/${totalScored}`} />
      </View>

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) =>
          `${pageNumber} / ${totalPages}`
        }
        fixed
      />
    </Page>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F3F4F6",
        borderRadius: 6,
        padding: 12,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Helvetica-Bold",
          color: "#111827",
          marginBottom: 4,
        }}
      >
        {value}
      </Text>
      <Text style={{ fontSize: 8, color: "#6B7280" }}>{label}</Text>
    </View>
  );
}
