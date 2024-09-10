import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  usersAuthloginSchema,
  usersAuthRegisterSchema,
} from "../schemas/usersSchemas.js";

import userContollers from "../controllers/userContollers.js";
import { userAuthToken } from "../Middlewares/Middlewares.js";
import { dowloadAvatar } from "../Middlewares/Middlewares.js";
import { emailSchema } from "../schemas/usersSchemas.js";
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

usersRouter.get("/current", userAuthToken, userContollers.currentUser);

usersRouter.patch(
  "/avatars",
  userAuthToken,
  dowloadAvatar,
  userContollers.updateAvatar
);

usersRouter.get("/verify/:verificationToken", userContollers.verifyEmail);

usersRouter.post(
  "/verify",
  validateBody(emailSchema),
  userContollers.resendVerifyEmail
);

export default usersRouter;
