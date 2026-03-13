import { Page, View, Text } from "@react-pdf/renderer";
import type { BusinessImpact, UnifiedAuditResult } from "../types";
import { styles } from "./pdf-styles";

interface Props {
  impact: BusinessImpact;
  result: UnifiedAuditResult;
}

function fmtNum(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

export function BusinessImpactPage({ impact, result }: Props) {
  const hasKeywords = impact.topMissedKeywords.length > 0;

  // Calculate points lost from failing signals
  const rescue = result.raw?.rescue;
  let pointsLost = 0;
  let failingCount = 0;
  if (rescue?.categories) {
    for (const cat of rescue.categories) {
      for (const sig of cat.signals || []) {
        if (sig.status === "fail") {
          pointsLost += sig.maxPoints - sig.points;
          failingCount++;
        }
      }
    }
  }
  const maxScore = rescue?.maxScore || 100;
  const scaledPointsLost = Math.round((pointsLost / maxScore) * 100);
  const potentialScore = Math.min(result.score.overall + scaledPointsLost, 100);

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>
        What This Is Costing Your Business
      </Text>

      <Text style={[styles.bodyText, { marginBottom: 16, lineHeight: 1.7 }]}>
        People are searching for exactly what you offer — but finding your
        competitors instead. Here's what you're missing out on right now.
      </Text>

      {/* Summary bar */}
      <View
        style={{
          backgroundColor: "#111827",
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          flexDirection: "row",
          gap: 12,
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 6, padding: 10 }}>
          <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: "#FCA5A5", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            Points Lost
          </Text>
          <Text style={{ fontSize: 22, fontFamily: "Helvetica-Bold", color: "#FFFFFF" }}>
            {scaledPointsLost}
          </Text>
          <Text style={{ fontSize: 7, color: "#9CA3AF", marginTop: 2 }}>
            from {failingCount} failing signals
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 6, padding: 10 }}>
          <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: "#86EFAC", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            Potential Score
          </Text>
          <Text style={{ fontSize: 22, fontFamily: "Helvetica-Bold", color: "#4ADE80" }}>
            {potentialScore}
          </Text>
          <Text style={{ fontSize: 7, color: "#9CA3AF", marginTop: 2 }}>
            if all issues are fixed
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 6, padding: 10 }}>
          <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: "#FCD34D", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            Missed Sales
          </Text>
          <Text style={{ fontSize: 22, fontFamily: "Helvetica-Bold", color: "#FBBF24" }}>
            {fmtNum(impact.missedSales)}/mo
          </Text>
          <Text style={{ fontSize: 7, color: "#9CA3AF", marginTop: 2 }}>
            customers going to competitors
          </Text>
        </View>
      </View>

      {/* Top missed keywords */}
      {hasKeywords && (
        <View>
          <Text style={styles.sectionSubtitle}>
            Searches Where Competitors Are Beating You
          </Text>

          <Text style={{ fontSize: 9, color: "#6B7280", marginBottom: 8, lineHeight: 1.5 }}>
            These are real searches people make every month for businesses like yours.
            You're either not ranking or not ranking high enough to get the clicks.
          </Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 3 }]}>What People Search</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "center" }]}>
              Your Rank
            </Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5, textAlign: "right" }]}>
              Monthly{"\n"}Searches
            </Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5, textAlign: "right" }]}>
              Visitors You're{"\n"}Missing
            </Text>
          </View>

          {impact.topMissedKeywords.map((kw, i) => (
            <View
              key={i}
              style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
            >
              <Text style={[styles.tableCellBold, { flex: 3 }]}>
                "{kw.keyword}"
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "center", color: kw.position === 0 ? "#DC2626" : undefined }]}>
                {kw.position === 0 ? "—" : `#${kw.position}`}
              </Text>
              <Text style={[styles.tableCell, { flex: 1.5, textAlign: "right" }]}>
                {kw.searchVolume.toLocaleString()}
              </Text>
              <Text
                style={[
                  styles.tableCellBold,
                  { flex: 1.5, textAlign: "right", color: "#DC2626" },
                ]}
              >
                {kw.missedClicks.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Disclaimer */}
      <View style={{ marginTop: 14 }}>
        <Text style={{ fontSize: 7, color: "#9CA3AF", lineHeight: 1.5, fontStyle: "italic" }}>
          Visitor counts are based on real Google ranking data. Sales estimates use
          industry-average conversion rates for {impact.assumptions.industry} businesses.
          Your actual results will depend on your website, sales process, and customer value.
        </Text>
      </View>

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  );
}
