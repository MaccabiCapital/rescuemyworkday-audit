import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./pdf-styles";

export function MethodologyPage() {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Methodology</Text>

      <Text style={styles.bodyText}>
        RescueAudit evaluates websites using a multi-engine architecture that
        combines automated crawling, rule-based analysis, and cross-page
        intelligence to produce a single unified visibility score out of 100.
      </Text>

      {/* Three pillars */}
      <Text style={styles.sectionSubtitle}>Three Visibility Pillars</Text>

      <View style={styles.methoGrid}>
        <View style={[styles.methoCard, { borderTopWidth: 3, borderTopColor: "#0057FF" }]}>
          <Text style={[styles.methoCardTitle, { color: "#0057FF" }]}>SEO</Text>
          <Text style={styles.methoCardText}>
            Traditional search engine optimization — technical health, content
            quality, crawlability, and link signals that drive organic rankings.
          </Text>
        </View>
        <View style={[styles.methoCard, { borderTopWidth: 3, borderTopColor: "#8B5CF6" }]}>
          <Text style={[styles.methoCardTitle, { color: "#8B5CF6" }]}>AIO</Text>
          <Text style={styles.methoCardText}>
            AI optimization — structured data, schema completeness, and machine
            readability that help AI models understand and cite your content.
          </Text>
        </View>
        <View style={[styles.methoCard, { borderTopWidth: 3, borderTopColor: "#059669" }]}>
          <Text style={[styles.methoCardTitle, { color: "#059669" }]}>GEO</Text>
          <Text style={styles.methoCardText}>
            Generative engine optimization — content citability, brand signals,
            and authority markers that influence AI-generated answers.
          </Text>
        </View>
      </View>

      {/* Six dimensions */}
      <Text style={styles.sectionSubtitle}>Six Scoring Dimensions</Text>

      <Text style={styles.bodyText}>
        Each pillar score is computed from weighted contributions of six
        underlying dimensions:
      </Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { width: "30%" }]}>DIMENSION</Text>
        <Text style={[styles.tableHeaderCell, { width: "70%" }]}>WHAT IT MEASURES</Text>
      </View>

      {DIMENSIONS.map((dim, idx) => (
        <View
          key={dim.name}
          style={idx % 2 === 1 ? styles.tableRowAlt : styles.tableRow}
        >
          <Text style={[styles.tableCellBold, { width: "30%" }]}>{dim.name}</Text>
          <Text style={[styles.tableCell, { width: "70%" }]}>{dim.desc}</Text>
        </View>
      ))}

      {/* Scoring weights */}
      <Text style={[styles.sectionSubtitle, { marginTop: 16 }]}>Scoring</Text>
      <Text style={styles.bodyText}>
        Dimensions contribute different weights to each pillar. A single
        dimension can influence multiple pillars — for example, Content Quality
        impacts SEO, AIO, and GEO. The overall score is the weighted average
        of all three pillar scores.
      </Text>

      {/* Engine credits */}
      <Text style={styles.sectionSubtitle}>Audit Engines</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { width: "25%" }]}>ENGINE</Text>
        <Text style={[styles.tableHeaderCell, { width: "75%" }]}>ROLE</Text>
      </View>
      {ENGINES.map((eng, idx) => (
        <View
          key={eng.name}
          style={idx % 2 === 1 ? styles.tableRowAlt : styles.tableRow}
        >
          <Text style={[styles.tableCellBold, { width: "25%" }]}>{eng.name}</Text>
          <Text style={[styles.tableCell, { width: "75%" }]}>{eng.role}</Text>
        </View>
      ))}

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

const DIMENSIONS = [
  {
    name: "Technical Foundation",
    desc: "Title tags, meta descriptions, H1 structure, canonical URLs, internal linking, HTTPS, sitemaps, robots.txt",
  },
  {
    name: "Content Quality",
    desc: "Word count, readability, keyword placement, content depth, AI readability scoring",
  },
  {
    name: "Schema & Structure",
    desc: "JSON-LD structured data, Open Graph tags, schema type coverage, completeness and validity",
  },
  {
    name: "AI Engine Readiness",
    desc: "Machine-parseable content, AI crawler accessibility, citation-ready formatting, answer-box eligibility",
  },
  {
    name: "Performance & Security",
    desc: "Core Web Vitals (LCP, CLS, INP), image optimization, HTTPS enforcement, security headers",
  },
  {
    name: "Trust & Authority",
    desc: "Brand signals, backlink indicators, domain trust markers, knowledge panel eligibility",
  },
];

const ENGINES = [
  {
    name: "SEOmator",
    role: "251-rule technical crawler covering 21 SEO categories with Core Web Vitals measurement",
  },
  {
    name: "RescueAudit",
    role: "AI-focused analysis engine evaluating content quality, schema, and AI readiness signals",
  },
  {
    name: "NativePort",
    role: "Cross-page intelligence engine detecting cannibalization, schema drift, and topical gaps",
  },
];
