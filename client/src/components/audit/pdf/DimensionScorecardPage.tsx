import { Page, View, Text } from "@react-pdf/renderer";
import type { UnifiedAuditResult, DimensionKey } from "../types";
import { styles } from "./pdf-styles";
import { DIMENSION_ORDER, getScoreColor } from "./pdf-utils";

interface Props {
  result: UnifiedAuditResult;
}

const FRIENDLY_LABELS: Record<DimensionKey, string> = {
  technicalFoundation: "Technical Setup",
  contentQuality: "Content Quality",
  schemaStructure: "Data Tags & Labels",
  aiEngineReadiness: "AI Visibility",
  perfSecurity: "Speed & Security",
  trustAuthority: "Trust & Reputation",
};

const FRIENDLY_DESCRIPTIONS: Record<DimensionKey, string> = {
  technicalFoundation:
    "Can Google and other search engines find and read all your pages correctly?",
  contentQuality:
    "Is your content well-written, helpful, and targeting the right topics for your audience?",
  schemaStructure:
    "Does your website include the hidden labels that help search engines understand your business?",
  aiEngineReadiness:
    "Can AI tools like ChatGPT and Google AI read your content and recommend your business?",
  perfSecurity:
    "Does your website load fast and keep your visitors' data safe?",
  trustAuthority:
    "Does your website look trustworthy and authoritative to search engines?",
};

function getGrade(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Poor";
  return "Critical";
}

export function DimensionScorecardPage({ result }: Props) {
  const { dimensions } = result;

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Your Website Report Card</Text>

      <Text style={[styles.bodyText, { marginBottom: 16, lineHeight: 1.7 }]}>
        We evaluated your website in six areas. Here's how you scored in each
        one, along with how many checks passed and failed.
      </Text>

      {DIMENSION_ORDER.map((key) => {
        const dim = dimensions[key];
        const color = getScoreColor(dim.score);
        const grade = getGrade(dim.score);

        return (
          <View
            key={key}
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 6,
              borderLeftWidth: 4,
              borderLeftColor: color,
              padding: 10,
              marginBottom: 8,
            }}
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
              <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" }}>
                {FRIENDLY_LABELS[key]}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ fontSize: 9, color }}>
                  {grade}
                </Text>
                <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold", color }}>
                  {dim.score}/100
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: 9, color: "#6B7280", marginBottom: 6, lineHeight: 1.4 }}>
              {FRIENDLY_DESCRIPTIONS[key]}
            </Text>

            {/* Progress bar */}
            <View style={{ height: 6, backgroundColor: "#E5E7EB", borderRadius: 3, marginBottom: 6 }}>
              <View
                style={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: color,
                  width: `${Math.max(dim.score, 2)}%`,
                }}
              />
            </View>

            {/* Pass/Fail counts */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Text style={{ fontSize: 8, color: "#22C55E" }}>
                {dim.findingsCount.pass} passed
              </Text>
              {dim.findingsCount.warn > 0 && (
                <Text style={{ fontSize: 8, color: "#F59E0B" }}>
                  {dim.findingsCount.warn} warnings
                </Text>
              )}
              {dim.findingsCount.fail > 0 && (
                <Text style={{ fontSize: 8, color: "#EF4444" }}>
                  {dim.findingsCount.fail} failed
                </Text>
              )}
            </View>
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
