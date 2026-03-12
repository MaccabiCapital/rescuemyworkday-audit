import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./pdf-styles";

export function MethodologyPage() {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>How We Audited Your Website</Text>

      <Text style={[styles.bodyText, { lineHeight: 1.7, marginBottom: 16 }]}>
        We used three different scanning tools to check over 250 things on your
        website. Here's what we looked at and why it matters.
      </Text>

      {/* What we measured */}
      <Text style={styles.sectionSubtitle}>What We Checked</Text>

      <View style={{ marginBottom: 16 }}>
        {AREAS.map((area, idx) => (
          <View
            key={area.name}
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: "#E5E7EB",
              paddingVertical: 8,
              paddingHorizontal: 6,
              backgroundColor: idx % 2 === 1 ? "#F9FAFB" : "transparent",
            }}
          >
            <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111827", width: "28%" }}>
              {area.name}
            </Text>
            <Text style={{ fontSize: 9, color: "#374151", width: "72%", lineHeight: 1.5 }}>
              {area.plain}
            </Text>
          </View>
        ))}
      </View>

      {/* Three pillars explained simply */}
      <Text style={styles.sectionSubtitle}>Your Three Scores Explained</Text>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
        <View style={{ flex: 1, borderWidth: 1, borderColor: "#BFDBFE", borderRadius: 6, padding: 10, backgroundColor: "#EFF6FF" }}>
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#0057FF", marginBottom: 4 }}>
            SEO
          </Text>
          <Text style={{ fontSize: 8, color: "#1E3A8A", lineHeight: 1.5 }}>
            How well you show up in Google and Bing when people search for what
            you offer.
          </Text>
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: "#DDD6FE", borderRadius: 6, padding: 10, backgroundColor: "#F5F3FF" }}>
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#8B5CF6", marginBottom: 4 }}>
            AIO
          </Text>
          <Text style={{ fontSize: 8, color: "#4C1D95", lineHeight: 1.5 }}>
            How well AI tools like ChatGPT and Google AI can understand and
            recommend your business.
          </Text>
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: "#A7F3D0", borderRadius: 6, padding: 10, backgroundColor: "#ECFDF5" }}>
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#059669", marginBottom: 4 }}>
            GEO
          </Text>
          <Text style={{ fontSize: 8, color: "#064E3B", lineHeight: 1.5 }}>
            How likely AI-generated answers are to mention your business when
            people ask questions.
          </Text>
        </View>
      </View>

      {/* How scoring works */}
      <Text style={styles.sectionSubtitle}>How Scoring Works</Text>
      <Text style={[styles.bodyText, { lineHeight: 1.7 }]}>
        Your overall score (out of 100) combines all three pillar scores. Each
        check on your website either passes, fails, or gets a warning. Failed
        checks lower your score based on how important they are. The higher your
        score, the easier it is for customers to find you online.
      </Text>

      <View style={{ backgroundColor: "#F3F4F6", borderRadius: 6, padding: 10, marginTop: 10 }}>
        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#22C55E", width: "25%" }}>
            80-100: Excellent
          </Text>
          <Text style={{ fontSize: 9, color: "#374151", width: "75%" }}>
            Your website is well-optimized. Keep it up!
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#0057FF", width: "25%" }}>
            60-79: Good
          </Text>
          <Text style={{ fontSize: 9, color: "#374151", width: "75%" }}>
            Solid foundation with room to improve.
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#F59E0B", width: "25%" }}>
            40-59: Needs Work
          </Text>
          <Text style={{ fontSize: 9, color: "#374151", width: "75%" }}>
            Significant gaps that are costing you customers.
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#EF4444", width: "25%" }}>
            0-39: Critical
          </Text>
          <Text style={{ fontSize: 9, color: "#374151", width: "75%" }}>
            Major issues — customers can't find you online.
          </Text>
        </View>
      </View>

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

const AREAS = [
  {
    name: "Technical Setup",
    plain: "Can search engines find and read all your pages? Covers things like page titles, descriptions, links between pages, and sitemaps.",
  },
  {
    name: "Content Quality",
    plain: "Is your content helpful, well-written, and targeting the right topics? We check readability, keyword usage, and depth of information.",
  },
  {
    name: "Data Tags",
    plain: "Does your website include the hidden labels that help Google show rich results (stars, prices, hours) in search?",
  },
  {
    name: "AI Visibility",
    plain: "Can AI tools like ChatGPT read your content and recommend your business when people ask questions?",
  },
  {
    name: "Speed & Security",
    plain: "Does your site load fast and keep visitor data safe? Slow sites lose visitors and rank lower.",
  },
  {
    name: "Trust & Reputation",
    plain: "Does your website look trustworthy to search engines? Covers brand signals and authority indicators.",
  },
];
