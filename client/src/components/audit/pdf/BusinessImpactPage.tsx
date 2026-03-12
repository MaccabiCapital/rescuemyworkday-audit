import { Page, View, Text } from "@react-pdf/renderer";
import type { BusinessImpact } from "../types";
import { styles } from "./pdf-styles";

interface Props {
  impact: BusinessImpact;
}

function fmt(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value.toFixed(0)}`;
}

export function BusinessImpactPage({ impact }: Props) {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Business Impact</Text>

      <Text style={[styles.bodyText, { marginBottom: 16 }]}>
        Revenue opportunity based on current keyword rankings and search volumes.
      </Text>

      {/* Big numbers */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#EFF6FF",
            borderRadius: 6,
            padding: 14,
            borderWidth: 1,
            borderColor: "#BFDBFE",
          }}
        >
          <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#2563EB", marginBottom: 4 }}>
            MISSED TRAFFIC VALUE (REAL DATA)
          </Text>
          <Text style={{ fontSize: 24, fontFamily: "Helvetica-Bold", color: "#1E3A8A" }}>
            {fmt(impact.missedTrafficValue)}/mo
          </Text>
          <Text style={{ fontSize: 8, color: "#3B82F6", marginTop: 4 }}>
            Based on actual keyword positions and search volumes
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#FFFBEB",
            borderRadius: 6,
            padding: 14,
            borderWidth: 1,
            borderColor: "#FDE68A",
          }}
        >
          <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#D97706", marginBottom: 4 }}>
            EST. LOST REVENUE (ESTIMATED)
          </Text>
          <Text style={{ fontSize: 24, fontFamily: "Helvetica-Bold", color: "#92400E" }}>
            {fmt(impact.estimatedLostRevenue)}/mo
          </Text>
          <Text style={{ fontSize: 8, color: "#D97706", marginTop: 4 }}>
            {impact.assumptions.industry} industry avg. conversion & order value
          </Text>
        </View>
      </View>

      {/* Top missed keywords table */}
      {impact.topMissedKeywords.length > 0 && (
        <View>
          <Text style={styles.sectionSubtitle}>Top Missed Keywords</Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Keyword</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "center" }]}>Pos.</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5, textAlign: "right" }]}>Volume</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5, textAlign: "right" }]}>Missed Clicks</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5, textAlign: "right" }]}>Missed Value</Text>
          </View>

          {impact.topMissedKeywords.map((kw, i) => (
            <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <Text style={[styles.tableCellBold, { flex: 3 }]}>{kw.keyword}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>#{kw.position}</Text>
              <Text style={[styles.tableCell, { flex: 1.5, textAlign: "right" }]}>
                {kw.searchVolume.toLocaleString()}
              </Text>
              <Text style={[styles.tableCell, { flex: 1.5, textAlign: "right" }]}>
                {kw.missedClicks.toLocaleString()}
              </Text>
              <Text
                style={[
                  styles.tableCellBold,
                  { flex: 1.5, textAlign: "right", color: "#DC2626" },
                ]}
              >
                {fmt(kw.missedValue)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Assumptions */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.sectionSubtitle}>Assumptions</Text>
        <View style={[styles.card, { backgroundColor: "#F9FAFB" }]}>
          <Text style={{ fontSize: 9, color: "#374151", marginBottom: 6 }}>
            Industry: {impact.assumptions.industry}
          </Text>
          <Text style={{ fontSize: 9, color: "#374151", marginBottom: 4 }}>
            Conversion Rate: {(impact.assumptions.conversionRate * 100).toFixed(1)}% —{" "}
            {impact.assumptions.conversionRationale}
          </Text>
          <Text style={{ fontSize: 9, color: "#374151", marginBottom: 8 }}>
            Avg Order Value: ${impact.assumptions.avgOrderValue.toLocaleString()} —{" "}
            {impact.assumptions.avgOrderRationale}
          </Text>
          <Text style={{ fontSize: 8, color: "#92400E", fontStyle: "italic", lineHeight: 1.5 }}>
            Missed traffic value is based on real ranking data. Lost revenue uses
            industry-average estimates for your niche — actual results depend on your
            conversion rate and pricing.
          </Text>
        </View>
      </View>

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  );
}
