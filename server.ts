import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", frontend: "desuper", backend: BACKEND_URL });
});

app.use("/api", async (req, res) => {
  try {
    const backendRes = await fetch(`${BACKEND_URL}${req.url}`, {
      method: req.method,
      headers: {
        ...(req.headers.authorization ? { Authorization: req.headers.authorization as string } : {}),
        ...(req.headers["content-type"] ? { "Content-Type": req.headers["content-type"] as string } : {}),
      },
      body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
    });

    const contentType = backendRes.headers.get("content-type") || "application/json";
    res.status(backendRes.status);
    res.setHeader("content-type", contentType);
    const body = await backendRes.text();
    res.send(body);
  } catch (err) {
    res.status(502).json({ error: "Backend unavailable", detail: String(err) });
  }
});

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
    console.log(`Backend proxy -> ${BACKEND_URL}`);
  });
}

startServer();
