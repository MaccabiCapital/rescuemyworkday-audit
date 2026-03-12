import { Router, type Request, type Response } from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = Router();

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

let anthropic: Anthropic | null = null;
function getClient() {
  if (!anthropic) {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropic;
}

router.post("/", async (req: Request, res: Response) => {
  const { url, domain, overallScore, categories } = req.body;

  if (!url || !domain || overallScore == null || !categories) {
    res.status(400).json({ error: "Missing required fields (url, domain, overallScore, categories)" });
    return;
  }

  try {
    const failingSignals = categories
      .flatMap((cat: any) => cat.signals)
      .filter(
        (s: any) => s.status === "fail" || s.status === "warning",
      );

    const prompt = `You are an SEO and AI optimization expert. Analyze these audit results for ${domain} (overall score: ${overallScore}/100) and create a prioritized action plan.

Failing signals:
${failingSignals.map((s: any) => `- ${s.name}: ${s.detail} (${s.status}, ${s.points}/${s.maxPoints} points)`).join("\n")}

Categories:
${categories.map((c: any) => `- ${c.name}: ${c.score}/${c.maxPoints}`).join("\n")}

Return a JSON object with:
{
  "summary": "2-3 sentence executive summary of the site's biggest opportunities",
  "items": [
    {
      "signalName": "Signal Name",
      "priority": "critical|high|medium|low",
      "category": "Category Name",
      "whatIsWrong": "Clear description of the issue",
      "howToFix": "Step-by-step fix instructions",
      "codeExample": "Optional code snippet if applicable",
      "estimatedTime": "e.g. '15 minutes', '1-2 hours'",
      "impactScore": 1-5,
      "difficultyScore": 1-5,
      "scoreImpact": estimated_points_gained,
      "businessBenefit": "Why this matters for the business"
    }
  ]
}

Sort items by priority (critical first), then by impact score descending. Only return valid JSON, no markdown.`;

    const client = getClient();
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON — strip markdown fences if present
    const cleaned = text.replace(/^```json?\n?/m, "").replace(/\n?```$/m, "");
    const plan = JSON.parse(cleaned);

    res.json(plan);
  } catch (err: any) {
    console.error("[action-plan] Error:", err);
    res.status(500).json({ error: "Failed to generate action plan" });
  }
});

export default router;
