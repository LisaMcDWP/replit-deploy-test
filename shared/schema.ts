import { z } from "zod";

export const objectiveStatusEnum = z.enum(["pending", "in-progress", "completed"]);
export const objectivePriorityEnum = z.enum(["high", "medium", "low"]);

export const objectiveCategoryEnum = z.enum(["Physical Therapy", "Monitoring", "Education", "Integration", "Assessment"]);

export const insertObjectiveSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: objectiveCategoryEnum,
  status: objectiveStatusEnum.default("pending"),
  priority: objectivePriorityEnum,
  targetDate: z.string().min(1, "Target date is required"),
});

export const updateObjectiveSchema = z.object({
  title: z.string().min(1).optional(),
  category: objectiveCategoryEnum.optional(),
  status: objectiveStatusEnum.optional(),
  priority: objectivePriorityEnum.optional(),
  targetDate: z.string().min(1).optional(),
});

export type InsertObjective = z.infer<typeof insertObjectiveSchema>;

export interface Objective {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  targetDate: string;
}
