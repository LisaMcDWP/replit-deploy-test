import { type Objective, type InsertObjective } from "@shared/schema";
import { getBigQueryClient, getDataset, TABLE_NAME } from "./bigquery";
import { randomUUID } from "crypto";

export interface IStorage {
  getObjectives(): Promise<Objective[]>;
  getObjective(id: string): Promise<Objective | undefined>;
  createObjective(objective: InsertObjective): Promise<Objective>;
  updateObjective(id: string, updates: Partial<InsertObjective>): Promise<Objective | undefined>;
  deleteObjective(id: string): Promise<boolean>;
}

export class BigQueryStorage implements IStorage {
  private get fullTable() {
    return `\`${process.env.GCP_PROJECT_ID}.${getDataset()}.${TABLE_NAME}\``;
  }

  async getObjectives(): Promise<Objective[]> {
    const bq = getBigQueryClient();
    const query = `SELECT id, title, category, status, priority, targetDate FROM ${this.fullTable} ORDER BY targetDate ASC`;
    const [rows] = await bq.query({ query });
    return rows as Objective[];
  }

  async getObjective(id: string): Promise<Objective | undefined> {
    const bq = getBigQueryClient();
    const query = `SELECT id, title, category, status, priority, targetDate FROM ${this.fullTable} WHERE id = @id LIMIT 1`;
    const [rows] = await bq.query({ query, params: { id } });
    return (rows as Objective[])[0] || undefined;
  }

  async createObjective(insert: InsertObjective): Promise<Objective> {
    const bq = getBigQueryClient();
    const id = randomUUID();

    const objective: Objective = {
      id,
      title: insert.title,
      category: insert.category,
      status: insert.status || "pending",
      priority: insert.priority,
      targetDate: insert.targetDate,
    };

    const query = `INSERT INTO ${this.fullTable} (id, title, category, status, priority, targetDate) VALUES (@id, @title, @category, @status, @priority, @targetDate)`;
    await bq.query({
      query,
      params: {
        id: objective.id,
        title: objective.title,
        category: objective.category,
        status: objective.status,
        priority: objective.priority,
        targetDate: objective.targetDate,
      },
    });

    return objective;
  }

  async updateObjective(id: string, updates: Partial<InsertObjective>): Promise<Objective | undefined> {
    const bq = getBigQueryClient();

    const existing = await this.getObjective(id);
    if (!existing) return undefined;

    const setClauses: string[] = [];
    const params: Record<string, string> = { id };

    if (updates.title !== undefined) {
      setClauses.push("title = @title");
      params.title = updates.title;
    }
    if (updates.category !== undefined) {
      setClauses.push("category = @category");
      params.category = updates.category;
    }
    if (updates.status !== undefined) {
      setClauses.push("status = @status");
      params.status = updates.status;
    }
    if (updates.priority !== undefined) {
      setClauses.push("priority = @priority");
      params.priority = updates.priority;
    }
    if (updates.targetDate !== undefined) {
      setClauses.push("targetDate = @targetDate");
      params.targetDate = updates.targetDate;
    }

    if (setClauses.length === 0) return existing;

    const query = `UPDATE ${this.fullTable} SET ${setClauses.join(", ")} WHERE id = @id`;
    await bq.query({ query, params });

    return this.getObjective(id);
  }

  async deleteObjective(id: string): Promise<boolean> {
    const bq = getBigQueryClient();
    const existing = await this.getObjective(id);
    if (!existing) return false;

    const query = `DELETE FROM ${this.fullTable} WHERE id = @id`;
    await bq.query({ query, params: { id } });
    return true;
  }
}

export const storage = new BigQueryStorage();
