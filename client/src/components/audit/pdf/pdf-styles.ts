import { StyleSheet } from "@react-pdf/renderer";

const BRAND_BLUE = "#0057FF";

export const styles = StyleSheet.create({
  // Page
  page: {
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1F2937",
  },

  // Page number footer
  pageNumber: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#9CA3AF",
  },

  // Cover page
  coverPage: {
    paddingTop: 80,
    paddingBottom: 50,
    paddingHorizontal: 50,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1F2937",
  },
  coverBrand: {
    fontSize: 10,
    color: BRAND_BLUE,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    marginBottom: 40,
  },
  coverTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 8,
  },
  coverUrl: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 40,
  },
  coverScoreBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  coverScoreNumber: {
    fontSize: 60,
    fontFamily: "Helvetica-Bold",
    marginRight: 16,
  },
  coverScoreMeta: {
    flex: 1,
  },
  coverBand: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  coverDate: {
    fontSize: 10,
    color: "#6B7280",
  },
  coverPillarRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 30,
  },
  coverPillarCard: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
  },
  coverPillarLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  coverPillarScore: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  coverBarTrack: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
  },
  coverBarFill: {
    height: 6,
    borderRadius: 3,
  },
  coverFooter: {
    position: "absolute",
    bottom: 40,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#9CA3AF",
  },

  // Section headings
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: BRAND_BLUE,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    marginBottom: 8,
    marginTop: 12,
  },

  // Body text
  bodyText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#374151",
    marginBottom: 10,
  },

  // Tables
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#F9FAFB",
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  tableCell: {
    fontSize: 9,
    color: "#374151",
  },
  tableCellBold: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },

  // Badge
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },

  // Cards
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 4,
  },

  // Methodology
  methoGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  methoCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 10,
  },
  methoCardTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  methoCardText: {
    fontSize: 8,
    color: "#6B7280",
    lineHeight: 1.4,
  },
});
