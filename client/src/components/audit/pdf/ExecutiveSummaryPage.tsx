import { Page, View, Text } from "@react-pdf/renderer";
import type { UnifiedAuditResult } from "../types";
import { styles } from "./pdf-styles";
import { getScoreColor } from "./pdf-utils";

interface Props {
  result: UnifiedAuditResult;
}

function getScoreVerdict(score: number): string {
  if (score >= 80)
    return "Your website is in great shape. It's well-optimized for search engines and AI platforms. Focus on the few remaining issues to stay ahead of competitors.";
  if (score >= 60)
    return "Your website has a solid foundation but there are important gaps that are costing you potential customers. The good news: most of these can be fixed quickly.";
  if (score >= 40)
    return "Your website has significant issues that are preventing customers from finding you online. Several quick fixes can make a big difference right away.";
  return "Your website has serious problems that make it nearly invisible to search engines and AI platforms. Customers searching for your services are finding your competitors instead. Immediate action is needed.";
}

export function ExecutiveSummaryPage({ result }: Props) {
  const { score, findings } = result;
  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const highCount = findings.filter((f) => f.severity === "high").length;
  const passCount = findings.filter((f) => f.status === "pass").length;
  const totalScored = findings.filter((f) => f.affectsScore).length;
  const failCount = findings.filter((f) => f.status === "fail" && f.affectsScore).length;

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>What We Found</Text>

      {/* Verdict */}
      <Text style={[styles.bodyText, { fontSize: 11, lineHeight: 1.7, marginBottom: 16 }]}>
        {getScoreVerdict(score.overall)}
      </Text>

      {/* Key numbers */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#F3F4F6",
            borderRadius: 8,
            padding: 14,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Helvetica-Bold",
              color: getScoreColor(score.overall),
              marginBottom: 4,
            }}
          >
            {score.overall}
          </Text>
          <Text style={{ fontSize: 8, color: "#6B7280", textAlign: "center" }}>
            Visibility Score{"\n"}out of 100
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: criticalCount > 0 ? "#FEF2F2" : "#F0FDF4",
            borderRadius: 8,
            padding: 14,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Helvetica-Bold",
              color: criticalCount > 0 ? "#EF4444" : "#22C55E",
              marginBottom: 4,
            }}
          >
            {criticalCount + highCount}
          </Text>
          <Text style={{ fontSize: 8, color: "#6B7280", textAlign: "center" }}>
            Urgent Issues{"\n"}Need Attention
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "#F0FDF4",
            borderRadius: 8,
            padding: 14,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Helvetica-Bold",
              color: "#22C55E",
              marginBottom: 4,
            }}
          >
            {passCount}
          </Text>
          <Text style={{ fontSize: 8, color: "#6B7280", textAlign: "center" }}>
            Checks Passed{"\n"}out of {totalScored}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: failCount > 0 ? "#FEF2F2" : "#F3F4F6",
            borderRadius: 8,
            padding: 14,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Helvetica-Bold",
              color: failCount > 0 ? "#EF4444" : "#374151",
              marginBottom: 4,
            }}
          >
            {failCount}
          </Text>
          <Text style={{ fontSize: 8, color: "#6B7280", textAlign: "center" }}>
            Issues Found{"\n"}To Fix
          </Text>
        </View>
      </View>

      {/* What this means */}
      <Text style={styles.sectionSubtitle}>What Does This Score Mean?</Text>
      <Text style={[styles.bodyText, { lineHeight: 1.7 }]}>
        Your visibility score measures how easy it is for potential customers to
        find your website through Google, Bing, ChatGPT, and other AI tools.
        A higher score means more people can find you when they search for the
        products or services you offer.
      </Text>

      <Text style={[styles.bodyText, { lineHeight: 1.7 }]}>
        We checked {totalScored} different things on your website — from whether
        Google can read your pages properly, to whether your content is good
        enough to show up in AI-generated answers. The next pages break down
        exactly what's working, what's not, and how to fix it.
      </Text>

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
