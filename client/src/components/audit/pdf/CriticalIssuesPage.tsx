import { Page, View, Text } from "@react-pdf/renderer";
import type { UnifiedAuditResult } from "../types";
import { styles } from "./pdf-styles";
import { DIMENSION_LABELS, getSeverityColor } from "./pdf-utils";

interface Props {
  result: UnifiedAuditResult;
}

function severityLabel(severity: string): string {
  switch (severity) {
    case "critical":
      return "Fix immediately";
    case "high":
      return "Fix soon";
    case "medium":
      return "Should fix";
    case "low":
      return "Nice to have";
    default:
      return severity;
  }
}

function dimensionWhyItMatters(dim: string): string {
  switch (dim) {
    case "technicalFoundation":
      return "Search engines can't properly find or understand your pages.";
    case "contentQuality":
      return "Your content isn't ranking as well as it could for your target audience.";
    case "schemaStructure":
      return "Search engines and AI tools can't understand what your business does.";
    case "aiEngineReadiness":
      return "AI assistants like ChatGPT and Google AI won't recommend your business.";
    case "perfSecurity":
      return "Slow or insecure pages lose visitors and rank lower in search results.";
    case "trustAuthority":
      return "Your site doesn't look authoritative enough to rank above competitors.";
    default:
      return "This affects how visible your website is to potential customers.";
  }
}

export function CriticalIssuesPage({ result }: Props) {
  const issues = result.criticalIssues.slice(0, 5);

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Top Issues Costing You Customers</Text>

      <Text style={[styles.bodyText, { marginBottom: 16 }]}>
        These are the {issues.length} biggest problems holding your website back.
        Fixing these first will have the most impact on bringing new customers to
        your site.
      </Text>

      {issues.map((issue, idx) => {
        const sevColor = getSeverityColor(issue.finding.severity);
        return (
          <View
            key={issue.finding.checkId}
            style={[styles.card, { borderLeftWidth: 3, borderLeftColor: sevColor, marginBottom: 14 }]}
            wrap={false}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: sevColor,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: "#FFFFFF" }}>
                    {idx + 1}
                  </Text>
                </View>
                <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" }}>
                  {issue.finding.name}
                </Text>
              </View>
              <Text
                style={[
                  styles.badge,
                  { backgroundColor: `${sevColor}15`, color: sevColor },
                ]}
              >
                {severityLabel(issue.finding.severity)}
              </Text>
            </View>

            {/* The Problem */}
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#6B7280", marginBottom: 3, textTransform: "uppercase" }}>
                The Problem
              </Text>
              <Text style={{ fontSize: 9, color: "#374151", lineHeight: 1.5 }}>
                {issue.finding.detail}
              </Text>
            </View>

            {/* Why It Matters */}
            <View style={{ backgroundColor: "#FEF3C7", borderRadius: 4, padding: 8, marginBottom: 8 }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#92400E", marginBottom: 3, textTransform: "uppercase" }}>
                Why This Matters
              </Text>
              <Text style={{ fontSize: 9, color: "#78350F", lineHeight: 1.5 }}>
                {dimensionWhyItMatters(issue.dimension)} This issue is costing
                you an estimated {issue.estimatedScoreImpact} points on your
                visibility score.
              </Text>
            </View>

            {/* How To Fix It */}
            {issue.finding.recommendation && (
              <View style={{ backgroundColor: "#F0FDF4", borderRadius: 4, padding: 8 }}>
                <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#166534", marginBottom: 3, textTransform: "uppercase" }}>
                  How To Fix It
                </Text>
                <Text style={{ fontSize: 9, color: "#15803D", lineHeight: 1.5 }}>
                  {issue.finding.recommendation}
                </Text>
              </View>
            )}
          </View>
        );
      })}

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
