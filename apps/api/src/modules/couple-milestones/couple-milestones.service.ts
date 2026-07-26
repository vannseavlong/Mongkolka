import { randomUUID } from "node:crypto";
import { CoupleMilestonesModel } from "./couple-milestones.model.js";

export interface CreateMilestoneInput {
  title: string;
  task?: string;
  months_before: number;
}

export type UpdateMilestoneInput = Partial<CreateMilestoneInput> & { completed?: boolean };

export const CoupleMilestonesService = {
  list(actorSheetId: string) {
    return CoupleMilestonesModel.findMany(actorSheetId);
  },

  create(actorSheetId: string, input: CreateMilestoneInput) {
    return CoupleMilestonesModel.create(actorSheetId, {
      milestone_id: randomUUID(),
      completed: false,
      ...input,
    });
  },

  async update(actorSheetId: string, milestoneId: string, input: UpdateMilestoneInput) {
    await CoupleMilestonesModel.update(actorSheetId, milestoneId, { ...input });
    return CoupleMilestonesModel.findById(actorSheetId, milestoneId);
  },

  delete(actorSheetId: string, milestoneId: string) {
    return CoupleMilestonesModel.delete(actorSheetId, milestoneId);
  },
};
