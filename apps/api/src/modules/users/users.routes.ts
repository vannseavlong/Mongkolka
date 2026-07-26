import { Router } from "express";
import { UsersController } from "./users.controller.js";

export const usersRouter = Router();

usersRouter.get("/users", UsersController.list);
usersRouter.post("/users/:userId/approve", UsersController.approve);
usersRouter.post("/users/:userId/reject", UsersController.reject);
