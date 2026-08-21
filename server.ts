import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-init Gemini if key available
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    try {
      genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn("Gemini client initialization skipped or failed:", e);
    }
  }
  return genAI;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "DeSuper by s6ft", timestamp: Date.now() });
});

// AI Mentor Hint / Code Assistance
app.post("/api/ai/companion-hint", async (req, res) => {
  try {
    const { missionTitle, concept, playerCode, errorMessage, hintLevel } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback heuristics when API key is not yet set in environment
      return res.json({
        success: true,
        source: "local-mentor",
        hint: getHeuristicHint(missionTitle, concept, errorMessage, hintLevel),
      });
    }

    const prompt = `You are AURA-7, the intelligent cyber companion and Python mentor in the game "DeSuper" developed by s6ft.
The player is currently in mission: "${missionTitle}" focusing on the Python concept "${concept}".
Player's Python code:
\`\`\`python
${playerCode || "(empty)"}
\`\`\`
Detected issue/error: ${errorMessage || "None / player requesting advice"}
Hint level requested (1=subtle nudge, 2=concept explanation, 3=analogous example, 4=structural outline): ${hintLevel || 1}

Respond concisely in character as AURA-7 (futuristic, encouraging, cybernetic, clear, max 3-4 sentences). Do NOT give away the exact full solution unless it's Level 4, but guide their thinking with high educational precision.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      source: "gemini-mentor",
      hint: response.text || getHeuristicHint(missionTitle, concept, errorMessage, hintLevel),
    });
  } catch (err: any) {
    console.error("AI Mentor error:", err);
    res.json({
      success: true,
      source: "local-mentor-fallback",
      hint: getHeuristicHint(req.body.missionTitle, req.body.concept, req.body.errorMessage, req.body.hintLevel),
    });
  }
});

function getHeuristicHint(missionTitle: string, concept: string, error: string, level: number = 1): string {
  if (error && error.includes("SyntaxError")) {
    if (level === 1) return "[AURA-7 Alert]: Syntax anomaly detected. Check your punctuation and quotes carefully.";
    if (level === 2) return "[AURA-7 Scan]: In Python, strings require matching quotes (\"\" or '') and blocks require colons (:).";
    if (level === 3) return "[AURA-7 Example]: print(\"HELLO SYSTEM\") or if condition: [indent] action()";
    return "[AURA-7 Blueprint]: Ensure all brackets are closed and each statement follows proper Python syntax.";
  }
  if (level === 1) return `[AURA-7]: Focus on the objective of ${missionTitle}. What data or action is requested?`;
  if (level === 2) return `[AURA-7 Guide]: Remember how ${concept} works in Python. Build step-by-step.`;
  if (level === 3) return `[AURA-7 Simulation]: Test small pieces in the console first to inspect variables.`;
  return `[AURA-7 Protocol]: Review the mission requirements and execute the standard Python command structure.`;
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DeSuper Game Server by s6ft running on port ${PORT}`);
  });
}

startServer();
