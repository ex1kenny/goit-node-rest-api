import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavorite,
} from "../schemas/contactsSchemas.js";

import ContactController from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", ContactController.getAllContacts);

contactsRouter.get("/:id", ContactController.getOneContact);

contactsRouter.delete("/:id", ContactController.deleteContact);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  ContactController.createContact
);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  ContactController.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  validateBody(updateFavorite),
  ContactController.updateFavorite
);

export default contactsRouter;
