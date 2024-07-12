import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavorite,
} from "../schemas/contactsSchemas.js";
import { userAuthToken } from "../Middlewares/Middlewares.js";

import contactController from "../controllers/contactsControllers.js";



const contactsRouter = express.Router();



contactsRouter.get("/", userAuthToken, contactController.getAllContacts);

contactsRouter.get("/:id", userAuthToken, contactController.getOneContact);

contactsRouter.delete("/:id", userAuthToken, contactController.deleteContact);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  userAuthToken,
  contactController.createContact
);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  userAuthToken,
  contactController.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  validateBody(updateFavorite),
  userAuthToken,
  contactController.updateFavorite
);

export default contactsRouter;
