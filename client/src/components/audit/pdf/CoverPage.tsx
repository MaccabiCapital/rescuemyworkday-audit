import { Page, View, Text } from "@react-pdf/renderer";
import type { UnifiedAuditResult, PillarKey } from "../types";
import { styles } from "./pdf-styles";
import {
  getScoreColor,
  getScoreBandLabel,
  formatDate,
  PILLAR_LABELS,
  PILLAR_COLORS,
} from "./pdf-utils";

interface Props {
  result: UnifiedAuditResult;
}

export function CoverPage({ result }: Props) {
  const { meta, score } = result;
  const scoreColor = getScoreColor(score.overall);

  const pillars: PillarKey[] = ["seo", "aio", "geo"];

  return (
    <Page size="A4" style={styles.coverPage}>
      {/* Brand */}
      <Text style={styles.coverBrand}>RESCUEAUDIT</Text>

      {/* Title */}
      <Text style={styles.coverTitle}>Website Audit Report</Text>
      <Text style={styles.coverUrl}>{meta.url}</Text>

      {/* Overall score */}
      <View style={styles.coverScoreBlock}>
        <Text style={[styles.coverScoreNumber, { color: scoreColor }]}>
          {score.overall}
        </Text>
        <View style={styles.coverScoreMeta}>
          <Text style={[styles.coverBand, { color: scoreColor }]}>
            {getScoreBandLabel(score.band)}
          </Text>
          <Text style={styles.coverDate}>
            {formatDate(meta.auditedAt)} — {meta.domain}
          </Text>
        </View>
      </View>

      {/* Pillar score bars */}
      <View style={styles.coverPillarRow}>
        {pillars.map((key) => {
          const pillarScore = score.pillars[key];
          const color = PILLAR_COLORS[key];
          return (
            <View
              key={key}
              style={[
                styles.coverPillarCard,
                { backgroundColor: `${color}08`, borderWidth: 1, borderColor: `${color}25` },
              ]}
            >
              <Text style={[styles.coverPillarLabel, { color }]}>
                {PILLAR_LABELS[key]}
              </Text>
              <Text style={[styles.coverPillarScore, { color }]}>
                {pillarScore}
              </Text>
              {/* Score bar */}
              <View style={styles.coverBarTrack}>
                <View
                  style={[
                    styles.coverBarFill,
                    {
                      backgroundColor: color,
                      width: `${Math.max(pillarScore, 2)}%`,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.coverFooter}>
        <Text>Prepared by RescueAudit</Text>
        <Text>{formatDate(meta.auditedAt)}</Text>
      </View>
    </Page>
  );
}
