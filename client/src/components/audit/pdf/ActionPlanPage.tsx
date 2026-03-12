import { Page, View, Text } from "@react-pdf/renderer";
import type { ActionPlan } from "../types";
import { styles } from "./pdf-styles";
import { getPriorityColor } from "./pdf-utils";

interface Props {
  actionPlan: ActionPlan | null;
}

function priorityLabel(priority: string): string {
  switch (priority) {
    case "critical":
      return "Do First";
    case "high":
      return "Do Soon";
    case "medium":
      return "Do Next";
    case "low":
      return "When Ready";
    default:
      return priority;
  }
}

export function ActionPlanPage({ actionPlan }: Props) {
  if (!actionPlan) {
    return (
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Your Fix-It Checklist</Text>
        <Text style={[styles.bodyText, { lineHeight: 1.7 }]}>
          Your personalized action plan hasn't been generated yet. Visit the
          Action Plan tab in the audit interface to get step-by-step
          instructions for fixing every issue we found.
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

  const items = actionPlan.items.slice(0, 10);

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Your Fix-It Checklist</Text>

      {actionPlan.summary && (
        <Text style={[styles.bodyText, { marginBottom: 14, lineHeight: 1.7 }]}>
          {actionPlan.summary}
        </Text>
      )}

      {items.map((item, idx) => {
        const prioColor = getPriorityColor(item.priority);

        return (
          <View
            key={idx}
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 6,
              borderLeftWidth: 3,
              borderLeftColor: prioColor,
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
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flex: 1 }}>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#9CA3AF" }}>
                  {idx + 1}.
                </Text>
                <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111827" }}>
                  {item.signalName}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                {item.estimatedTime && (
                  <Text style={{ fontSize: 8, color: "#6B7280" }}>
                    {item.estimatedTime}
                  </Text>
                )}
                <Text
                  style={[
                    styles.badge,
                    { backgroundColor: `${prioColor}15`, color: prioColor },
                  ]}
                >
                  {priorityLabel(item.priority)}
                </Text>
              </View>
            </View>

            {/* What's wrong */}
            {item.whatIsWrong && (
              <View style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#6B7280", marginBottom: 2, textTransform: "uppercase" }}>
                  The Problem
                </Text>
                <Text style={{ fontSize: 9, color: "#374151", lineHeight: 1.5 }}>
                  {item.whatIsWrong}
                </Text>
              </View>
            )}

            {/* How to fix */}
            {item.howToFix && (
              <View style={{ backgroundColor: "#F0FDF4", borderRadius: 4, padding: 6 }}>
                <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#166534", marginBottom: 2, textTransform: "uppercase" }}>
                  How To Fix It
                </Text>
                <Text style={{ fontSize: 9, color: "#15803D", lineHeight: 1.5 }}>
                  {item.howToFix}
                </Text>
              </View>
            )}

            {/* Business benefit */}
            {item.businessBenefit && (
              <Text style={{ fontSize: 8, color: "#0057FF", marginTop: 4, fontStyle: "italic" }}>
                Impact: {item.businessBenefit}
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
