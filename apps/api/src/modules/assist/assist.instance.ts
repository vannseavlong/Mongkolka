import { AssistModel } from "./assist.model.js";
import { createAssistService } from "./assist.service.js";

export const AssistService = createAssistService(AssistModel);
