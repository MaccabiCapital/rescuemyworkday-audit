import { Page, View, Text } from "@react-pdf/renderer";
import type { Finding } from "../types";
import { styles } from "./pdf-styles";
import { getSeverityColor } from "./pdf-utils";

interface Props {
  findings: Finding[];
}

export function SecurityHealthPage({ findings }: Props) {
  // Security findings = those that don't affect the 100pt score
  const securityFindings = findings.filter((f) => !f.affectsScore);

  // Omit page entirely if no security data
  if (securityFindings.length === 0) return null;

  const passCount = securityFindings.filter((f) => f.status === "pass").length;
  const failCount = securityFindings.filter(
    (f) => f.status === "fail" || f.status === "warn",
  ).length;

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Security Health</Text>

      <View
        style={{
          backgroundColor: "#FEF3C7",
          borderRadius: 6,
          padding: 10,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 9, color: "#92400E", fontFamily: "Helvetica-Bold" }}>
          Note: Security checks are not part of the 100-point visibility score.
          They are included for your awareness and website health.
        </Text>
      </View>

      {/* Summary */}
      <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#F0FDF4",
            borderRadius: 6,
            padding: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: "#22C55E" }}>
            {passCount}
          </Text>
          <Text style={{ fontSize: 8, color: "#6B7280" }}>Passed</Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "#FEF2F2",
            borderRadius: 6,
            padding: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: "#EF4444" }}>
            {failCount}
          </Text>
          <Text style={{ fontSize: 8, color: "#6B7280" }}>Issues Found</Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "#F3F4F6",
            borderRadius: 6,
            padding: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: "#374151" }}>
            {securityFindings.length}
          </Text>
          <Text style={{ fontSize: 8, color: "#6B7280" }}>Total Checks</Text>
        </View>
      </View>

      {/* Findings list — only non-pass */}
      {securityFindings
        .filter((f) => f.status !== "pass")
        .map((finding) => {
          const sevColor = getSeverityColor(finding.severity);
          return (
            <View
              key={finding.checkId}
              style={[styles.card, { borderLeftWidth: 3, borderLeftColor: sevColor }]}
              wrap={false}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Text style={styles.cardTitle}>{finding.name}</Text>
                <Text
                  style={[
                    styles.badge,
                    { backgroundColor: `${sevColor}15`, color: sevColor },
                  ]}
                >
                  {finding.severity}
                </Text>
              </View>
              <Text style={{ fontSize: 9, color: "#374151", lineHeight: 1.5 }}>
                {finding.detail}
              </Text>
              {finding.recommendation && (
                <Text
                  style={{
                    fontSize: 8,
                    color: "#15803D",
                    marginTop: 4,
                    lineHeight: 1.4,
                  }}
                >
                  Fix: {finding.recommendation}
                </Text>
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
