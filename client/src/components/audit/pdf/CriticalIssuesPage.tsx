import { Page, View, Text } from "@react-pdf/renderer";
import type { UnifiedAuditResult } from "../types";
import { styles } from "./pdf-styles";
import { DIMENSION_LABELS, getSeverityColor } from "./pdf-utils";

interface Props {
  result: UnifiedAuditResult;
}

export function CriticalIssuesPage({ result }: Props) {
  const issues = result.criticalIssues.slice(0, 5);

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Critical Issues</Text>

      <Text style={[styles.bodyText, { marginBottom: 16 }]}>
        The top {issues.length} issues by severity and estimated score impact.
        Addressing these first will yield the greatest improvement.
      </Text>

      {issues.map((issue, idx) => {
        const sevColor = getSeverityColor(issue.finding.severity);
        return (
          <View
            key={issue.finding.checkId}
            style={[styles.card, { borderLeftWidth: 3, borderLeftColor: sevColor }]}
            wrap={false}
          >
            {/* Header row */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Helvetica-Bold",
                    color: "#6B7280",
                  }}
                >
                  #{idx + 1}
                </Text>
                <Text style={styles.cardTitle}>{issue.finding.name}</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <Text
                  style={[
                    styles.badge,
                    { backgroundColor: `${sevColor}15`, color: sevColor },
                  ]}
                >
                  {issue.finding.severity}
                </Text>
                <Text style={{ fontSize: 9, color: "#EF4444", fontFamily: "Helvetica-Bold" }}>
                  -{issue.estimatedScoreImpact} pts
                </Text>
              </View>
            </View>

            {/* Dimension */}
            <Text style={{ fontSize: 8, color: "#6B7280", marginBottom: 6 }}>
              {DIMENSION_LABELS[issue.dimension]}
            </Text>

            {/* Detail */}
            <Text style={{ fontSize: 9, color: "#374151", marginBottom: 6, lineHeight: 1.5 }}>
              {issue.finding.detail}
            </Text>

            {/* Fix recommendation */}
            {issue.finding.recommendation && (
              <View
                style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: 4,
                  padding: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 8,
                    fontFamily: "Helvetica-Bold",
                    color: "#166534",
                    marginBottom: 3,
                  }}
                >
                  HOW TO FIX
                </Text>
                <Text style={{ fontSize: 8, color: "#15803D", lineHeight: 1.5 }}>
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
