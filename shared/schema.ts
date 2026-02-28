import { z } from "zod";

export const objectiveStatusEnum = z.enum(["pending", "in-progress", "completed"]);
export const objectivePriorityEnum = z.enum(["high", "medium", "low"]);

export const insertObjectiveSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  status: objectiveStatusEnum.default("pending"),
  priority: objectivePriorityEnum,
  targetDate: z.string().min(1, "Target date is required"),
});

export const updateObjectiveSchema = insertObjectiveSchema.partial();

export type InsertObjective = z.infer<typeof insertObjectiveSchema>;

export interface Objective {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  targetDate: string;
}
