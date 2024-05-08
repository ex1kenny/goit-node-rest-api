import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  usersAuthloginSchema,
  usersAuthRegisterSchema,
} from "../schemas/usersSchemas.js";
import userContollers from "../controllers/userContollers.js";
import { userAuthToken } from "../Middlewares/Middlewares.js";
const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(usersAuthRegisterSchema),
  userContollers.registerUser
);

usersRouter.post(
  "/login",
  validateBody(usersAuthloginSchema),
  userContollers.loginUser
);

usersRouter.post("/logout", userAuthToken, userContollers.LogoutUser);

usersRouter.post("/current", userAuthToken, userContollers.currentUser);
export default usersRouter;
