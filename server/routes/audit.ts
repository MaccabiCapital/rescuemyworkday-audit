import { Router, type Request, type Response } from "express";
import { getDb, schema } from "../db/index.js";
import { desc, eq } from "drizzle-orm";

const router = Router();

const WORKER_URL =
  process.env.WORKER_URL || "https://rescueaudit-worker.fly.dev";
const WORKER_API_KEY = process.env.WORKER_API_KEY || "";

function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!url.match(/^https?:\/\//i)) url = "https://" + url;
  return url;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

// POST /api/audit — Start an audit, return auditId immediately
router.post("/", async (req: Request, res: Response) => {
  const { url, location } = req.body;
  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "URL is required" });
    return;
  }

  const normalized = normalizeUrl(url);

  try {
    const workerResp = await fetch(`${WORKER_URL}/api/v1/audit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WORKER_API_KEY}`,
      },
      body: JSON.stringify({ url: normalized, ...(location && { location }) }),
    });

    if (!workerResp.ok) {
      const text = await workerResp.text().catch(() => "Worker error");
      res.status(workerResp.status).json({ error: text });
      return;
    }

    const data = (await workerResp.json()) as { auditId: string };
    res.status(202).json({ auditId: data.auditId });
  } catch (err) {
    console.error("[audit] Worker unreachable:", err);
    res.status(503).json({ error: "Audit service temporarily unavailable" });
  }
});

// GET /api/audit/:id — Poll audit status, handle completion
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const workerResp = await fetch(`${WORKER_URL}/api/v1/audit/${id}`, {
      headers: { Authorization: `Bearer ${WORKER_API_KEY}` },
    });

    if (!workerResp.ok) {
      res.status(workerResp.status).json({ error: "Worker poll failed" });
      return;
    }

    const data = (await workerResp.json()) as any;

    // Still running
    if (data.status === "pending" || data.status === "running") {
      res.json({ status: data.status, progress: data.progress });
      return;
    }

    // Worker error
    if (data.status === "error") {
      res.json({ status: "error", error: data.error || "Audit failed" });
      return;
    }

    // Complete — inject delta and save
    if (data.status === "complete") {
      const result = data.result;
      const domain = getDomain(result.meta.url);
      const db = getDb();

      // Inject previous audit delta (non-fatal)
      if (db) {
        try {
          const [previous] = await db
            .select()
            .from(schema.audits)
            .where(eq(schema.audits.domain, domain))
            .orderBy(desc(schema.audits.createdAt))
            .limit(1);

          if (previous) {
            result.score.previousAudit = {
              overall: previous.overallScore,
              pillars: {
                seo: previous.seoScore,
                aio: previous.aioScore,
                geo: previous.geoScore,
              },
              auditedAt: previous.createdAt.toISOString(),
              delta: result.score.overall - previous.overallScore,
            };
          }
        } catch (dbErr) {
          console.warn("[audit] Failed to fetch previous audit:", dbErr);
        }
      }

      // Save to database — strip `raw` to save space (non-fatal)
      if (db) {
        try {
          const { raw, ...resultWithoutRaw } = result;
          await db.insert(schema.audits).values({
            domain,
            url: result.meta.url,
            overallScore: result.score.overall,
            seoScore: result.score.pillars.seo,
            aioScore: result.score.pillars.aio,
            geoScore: result.score.pillars.geo,
            band: result.score.band,
            resultJson: resultWithoutRaw,
          });
        } catch (dbErr) {
          console.warn("[audit] Failed to save audit:", dbErr);
        }
      }

      // Return FULL result including `raw` — ActionPlanSection needs result.raw.rescue.categories
      res.json({ status: "complete", result });
      return;
    }

    // Unknown status — pass through
    res.json(data);
  } catch (err) {
    console.error("[audit] Poll error:", err);
    res.status(503).json({ error: "Audit service temporarily unavailable" });
  }
});

export default router;
