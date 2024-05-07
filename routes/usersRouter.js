import express from "express";
import validateBody from "../helpers/validateBody.js";
import { usersAuthSchema } from "../schemas/usersSchemas.js";
import userContollers from "../controllers/userContollers.js";
const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(usersAuthSchema),
  userContollers.registerUser
);

export default usersRouter;
