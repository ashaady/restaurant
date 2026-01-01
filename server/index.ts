import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handlePaydunya_Initialize,
  handlePaydunya_Callback,
  handlePaydunya_Status,
} from "./routes/paydunya";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // PayDunya routes
  app.post("/api/paydunya/initialize", handlePaydunya_Initialize);
  app.post("/api/paydunya/callback", handlePaydunya_Callback);
  app.get("/api/paydunya/status/:orderId", handlePaydunya_Status);

  return app;
}
