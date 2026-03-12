import { Page, View, Text } from "@react-pdf/renderer";
import type { UnifiedAuditResult } from "../types";
import { styles } from "./pdf-styles";
import { DIMENSION_ORDER, DIMENSION_LABELS, getScoreColor } from "./pdf-utils";

interface Props {
  result: UnifiedAuditResult;
}

export function DimensionScorecardPage({ result }: Props) {
  const { dimensions } = result;

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Dimension Scorecard</Text>

      <Text style={[styles.bodyText, { marginBottom: 16 }]}>
        Your site is evaluated across six dimensions. Each dimension contributes
        weighted scores to the three visibility pillars (SEO, AIO, GEO).
      </Text>

      {/* Table header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { width: "30%" }]}>
          DIMENSION
        </Text>
        <Text style={[styles.tableHeaderCell, { width: "12%", textAlign: "center" }]}>
          SCORE
        </Text>
        <Text style={[styles.tableHeaderCell, { width: "22%" }]}>
          BAR
        </Text>
        <Text style={[styles.tableHeaderCell, { width: "12%", textAlign: "center" }]}>
          PASS
        </Text>
        <Text style={[styles.tableHeaderCell, { width: "12%", textAlign: "center" }]}>
          WARN
        </Text>
        <Text style={[styles.tableHeaderCell, { width: "12%", textAlign: "center" }]}>
          FAIL
        </Text>
      </View>

      {/* Table rows */}
      {DIMENSION_ORDER.map((key, idx) => {
        const dim = dimensions[key];
        const color = getScoreColor(dim.score);
        const rowStyle = idx % 2 === 1 ? styles.tableRowAlt : styles.tableRow;

        return (
          <View key={key} style={rowStyle}>
            <Text style={[styles.tableCellBold, { width: "30%" }]}>
              {DIMENSION_LABELS[key]}
            </Text>
            <Text
              style={[
                styles.tableCellBold,
                { width: "12%", textAlign: "center", color },
              ]}
            >
              {dim.score}
            </Text>
            {/* Score bar */}
            <View style={{ width: "22%", justifyContent: "center", paddingRight: 8 }}>
              <View
                style={{
                  height: 8,
                  backgroundColor: "#E5E7EB",
                  borderRadius: 4,
                }}
              >
                <View
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: color,
                    width: `${Math.max(dim.score, 2)}%`,
                  }}
                />
              </View>
            </View>
            <Text
              style={[
                styles.tableCell,
                { width: "12%", textAlign: "center", color: "#22C55E" },
              ]}
            >
              {dim.findingsCount.pass}
            </Text>
            <Text
              style={[
                styles.tableCell,
                { width: "12%", textAlign: "center", color: "#F59E0B" },
              ]}
            >
              {dim.findingsCount.warn}
            </Text>
            <Text
              style={[
                styles.tableCell,
                { width: "12%", textAlign: "center", color: "#EF4444" },
              ]}
            >
              {dim.findingsCount.fail}
            </Text>
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
