import {
  pgTable,
  serial,
  varchar,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const audits = pgTable(
  "audits",
  {
    id: serial("id").primaryKey(),
    domain: varchar("domain", { length: 255 }).notNull(),
    url: varchar("url", { length: 2048 }).notNull(),
    overallScore: integer("overall_score").notNull(),
    seoScore: integer("seo_score").notNull(),
    aioScore: integer("aio_score").notNull(),
    geoScore: integer("geo_score").notNull(),
    band: varchar("band", { length: 50 }).notNull(),
    resultJson: jsonb("result_json").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("audits_domain_idx").on(table.domain)],
);

export type Audit = typeof audits.$inferSelect;
export type InsertAudit = typeof audits.$inferInsert;
