import { Router } from "express";
import { RegistrationController } from "./registration.controller.js";

/** Public self-registration — creates a *pending* login identity + catalog row.
 * An admin approves it later from `/approvals` (see `UsersService.approve`),
 * which provisions the actor's Sheet and flips both rows to `active`. */
export const registrationRouter = Router();

registrationRouter.post("/couple/auth/register", RegistrationController.registerCouple);
registrationRouter.post("/vendor/auth/register", RegistrationController.registerVendor);
