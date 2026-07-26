import { z } from "zod";

export const milestoneSchema = z.object({
  milestone_id: z.string(),
  title: z.string(),
  task: z.string().nullable(),
  months_before: z.number(),
  completed: z.boolean(),
});

export type Milestone = z.infer<typeof milestoneSchema>;
