import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertObjectiveSchema, updateObjectiveSchema } from "@shared/schema";
import { ensureTableExists } from "./bigquery";
import { fromError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  try {
    await ensureTableExists();
  } catch (error: any) {
    console.error("BigQuery table setup warning:", error.message);
    console.error("The app will start but BigQuery operations may fail until permissions are configured.");
  }

  app.get("/api/objectives", async (_req, res) => {
    try {
      const objectives = await storage.getObjectives();
      res.json(objectives);
    } catch (error: any) {
      console.error("Error fetching objectives:", error);
      res.status(500).json({ message: "Failed to fetch objectives" });
    }
  });

  app.get("/api/objectives/:id", async (req, res) => {
    try {
      const objective = await storage.getObjective(req.params.id);
      if (!objective) {
        return res.status(404).json({ message: "Objective not found" });
      }
      res.json(objective);
    } catch (error: any) {
      console.error("Error fetching objective:", error);
      res.status(500).json({ message: "Failed to fetch objective" });
    }
  });

  app.post("/api/objectives", async (req, res) => {
    try {
      const parsed = insertObjectiveSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }
      const objective = await storage.createObjective(parsed.data);
      res.status(201).json(objective);
    } catch (error: any) {
      console.error("Error creating objective:", error);
      res.status(500).json({ message: "Failed to create objective" });
    }
  });

  app.patch("/api/objectives/:id", async (req, res) => {
    try {
      const parsed = updateObjectiveSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }
      const objective = await storage.updateObjective(req.params.id, parsed.data);
      if (!objective) {
        return res.status(404).json({ message: "Objective not found" });
      }
      res.json(objective);
    } catch (error: any) {
      console.error("Error updating objective:", error);
      res.status(500).json({ message: "Failed to update objective" });
    }
  });

  app.delete("/api/objectives/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteObjective(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Objective not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting objective:", error);
      res.status(500).json({ message: "Failed to delete objective" });
    }
  });

  return httpServer;
}
