import { Page, View, Text } from "@react-pdf/renderer";
import type { BusinessImpact } from "../types";
import { styles } from "./pdf-styles";

interface Props {
  impact: BusinessImpact;
}

function fmtNum(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

export function BusinessImpactPage({ impact }: Props) {
  const annualSales = impact.missedSales * 12;
  const hasKeywords = impact.topMissedKeywords.length > 0;

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>
        What This Is Costing Your Business
      </Text>

      <Text style={[styles.bodyText, { marginBottom: 16, lineHeight: 1.7 }]}>
        People are searching for exactly what you offer — but finding your
        competitors instead. Here's what you're missing out on right now.
      </Text>

      {/* Big sales number */}
      <View
        style={{
          backgroundColor: "#FEF2F2",
          borderRadius: 8,
          padding: 20,
          marginBottom: 12,
          borderWidth: 2,
          borderColor: "#FECACA",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 8,
            fontFamily: "Helvetica-Bold",
            color: "#991B1B",
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Sales You're Missing
        </Text>
        <Text
          style={{
            fontSize: 32,
            fontFamily: "Helvetica-Bold",
            color: "#DC2626",
          }}
        >
          {fmtNum(impact.missedSales)} /month
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "#991B1B",
            marginTop: 4,
          }}
        >
          That's approximately {fmtNum(annualSales)} sales per year
        </Text>
        <Text
          style={{
            fontSize: 8,
            color: "#B91C1C",
            marginTop: 8,
            fontStyle: "italic",
          }}
        >
          Based on {impact.assumptions.industry} industry conversion rates ({(impact.assumptions.conversionRate * 100).toFixed(1)}%)
        </Text>
      </View>

      {/* How we got this number */}
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#EFF6FF",
            borderRadius: 6,
            padding: 12,
            borderWidth: 1,
            borderColor: "#BFDBFE",
          }}
        >
          <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#1E40AF", marginBottom: 4 }}>
            MISSED WEBSITE VISITORS
          </Text>
          <Text style={{ fontSize: 9, color: "#1E3A8A", lineHeight: 1.5 }}>
            {fmtNum(impact.missedVisitors)} people search for your services every
            month but click on competitors ranking above you.
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "#FFFBEB",
            borderRadius: 6,
            padding: 12,
            borderWidth: 1,
            borderColor: "#FDE68A",
          }}
        >
          <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#92400E", marginBottom: 4 }}>
            HOW WE ESTIMATED SALES
          </Text>
          <Text style={{ fontSize: 9, color: "#78350F", lineHeight: 1.5 }}>
            We applied a {(impact.assumptions.conversionRate * 100).toFixed(1)}%
            conversion rate typical for {impact.assumptions.industry} businesses
            to calculate missed sales from those visitors.
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
