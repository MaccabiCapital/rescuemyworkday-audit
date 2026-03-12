import "dotenv/config";
import express from "express";
import path from "path";
import auditRouter from "./routes/audit.js";
import actionPlanRouter from "./routes/action-plan.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

// API routes
app.use("/api/audit", auditRouter);
app.use("/api/action-plan", actionPlanRouter);

// In production, serve Vite-built static files
const clientDir = path.join(__dirname, "../client");
app.use(express.static(clientDir));

// SPA fallback — serve index.html for all non-API routes
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(clientDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT}`);
});
