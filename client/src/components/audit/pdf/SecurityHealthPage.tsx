import { Page, View, Text } from "@react-pdf/renderer";
import type { Finding } from "../types";
import { styles } from "./pdf-styles";
import { getSeverityColor } from "./pdf-utils";

interface Props {
  findings: Finding[];
}

export function SecurityHealthPage({ findings }: Props) {
  const securityFindings = findings.filter((f) => !f.affectsScore);

  if (securityFindings.length === 0) return null;

  const passCount = securityFindings.filter((f) => f.status === "pass").length;
  const failFindings = securityFindings.filter((f) => f.status !== "pass");

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Website Safety Check</Text>

      <Text style={[styles.bodyText, { marginBottom: 12, lineHeight: 1.7 }]}>
        These checks look at whether your website is safe for visitors. While
        they don't directly affect your search ranking score, security problems
        can scare away customers and damage your reputation.
      </Text>

      {/* Summary */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#F0FDF4",
            borderRadius: 6,
            padding: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 22, fontFamily: "Helvetica-Bold", color: "#22C55E" }}>
            {passCount}
          </Text>
          <Text style={{ fontSize: 9, color: "#6B7280" }}>Safe</Text>
        </View>
        {failFindings.length > 0 && (
          <View
            style={{
              flex: 1,
              backgroundColor: "#FEF2F2",
              borderRadius: 6,
              padding: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 22, fontFamily: "Helvetica-Bold", color: "#EF4444" }}>
              {failFindings.length}
            </Text>
            <Text style={{ fontSize: 9, color: "#6B7280" }}>Need Attention</Text>
          </View>
        )}
      </View>

      {/* Failed findings */}
      {failFindings.map((finding) => {
        const sevColor = getSeverityColor(finding.severity);
        return (
          <View
            key={finding.checkId}
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 6,
              borderLeftWidth: 3,
              borderLeftColor: sevColor,
              padding: 10,
              marginBottom: 8,
            }}
            wrap={false}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111827" }}>
                {finding.name}
              </Text>
            </View>

            {/* What's wrong */}
            <View style={{ marginBottom: 6 }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#6B7280", marginBottom: 2, textTransform: "uppercase" }}>
                The Problem
              </Text>
              <Text style={{ fontSize: 9, color: "#374151", lineHeight: 1.5 }}>
                {finding.detail}
              </Text>
            </View>

            {/* How to fix */}
            {finding.recommendation && (
              <View style={{ backgroundColor: "#F0FDF4", borderRadius: 4, padding: 6 }}>
                <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#166534", marginBottom: 2, textTransform: "uppercase" }}>
                  How To Fix It
                </Text>
                <Text style={{ fontSize: 9, color: "#15803D", lineHeight: 1.5 }}>
                  {finding.recommendation}
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
