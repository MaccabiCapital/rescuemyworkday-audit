import { Page, View, Text } from "@react-pdf/renderer";
import type { ActionPlan } from "../types";
import { styles } from "./pdf-styles";
import { getPriorityColor } from "./pdf-utils";

interface Props {
  actionPlan: ActionPlan | null;
}

export function ActionPlanPage({ actionPlan }: Props) {
  if (!actionPlan) {
    return (
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Action Plan</Text>
        <Text style={styles.bodyText}>
          The action plan has not been generated yet. Visit the Action Plan tab
          in the audit interface to generate a personalized action plan.
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

  const items = actionPlan.items.slice(0, 15);

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Action Plan</Text>

      {actionPlan.summary && (
        <Text style={[styles.bodyText, { marginBottom: 16 }]}>
          {actionPlan.summary}
        </Text>
      )}

      {/* Table header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { width: "4%" }]}>#</Text>
        <Text style={[styles.tableHeaderCell, { width: "28%" }]}>ISSUE</Text>
        <Text style={[styles.tableHeaderCell, { width: "18%" }]}>CATEGORY</Text>
        <Text style={[styles.tableHeaderCell, { width: "14%", textAlign: "center" }]}>
          PRIORITY
        </Text>
        <Text style={[styles.tableHeaderCell, { width: "12%", textAlign: "center" }]}>
          TIME
        </Text>
        <Text style={[styles.tableHeaderCell, { width: "12%", textAlign: "center" }]}>
          IMPACT
        </Text>
        <Text style={[styles.tableHeaderCell, { width: "12%", textAlign: "center" }]}>
          QUICK WIN
        </Text>
      </View>

      {/* Table rows */}
      {items.map((item, idx) => {
        const prioColor = getPriorityColor(item.priority);
        const rowStyle = idx % 2 === 1 ? styles.tableRowAlt : styles.tableRow;

        return (
          <View key={idx} style={rowStyle} wrap={false}>
            <Text style={[styles.tableCell, { width: "4%" }]}>{idx + 1}</Text>
            <Text style={[styles.tableCellBold, { width: "28%" }]}>
              {item.signalName}
            </Text>
            <Text style={[styles.tableCell, { width: "18%" }]}>
              {item.category}
            </Text>
            <View style={{ width: "14%", alignItems: "center" }}>
              <Text
                style={[
                  styles.badge,
                  { backgroundColor: `${prioColor}15`, color: prioColor },
                ]}
              >
                {item.priority}
              </Text>
            </View>
            <Text
              style={[styles.tableCell, { width: "12%", textAlign: "center" }]}
            >
              {item.estimatedTime || "—"}
            </Text>
            <Text
              style={[styles.tableCell, { width: "12%", textAlign: "center" }]}
            >
              {item.scoreImpact ? `+${item.scoreImpact}` : "—"}
            </Text>
            <Text
              style={[styles.tableCell, { width: "12%", textAlign: "center" }]}
            >
              {item.isQuickWin ? "Yes" : "—"}
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
