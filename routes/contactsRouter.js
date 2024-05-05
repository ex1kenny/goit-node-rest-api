import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavorite,
} from "../schemas/contactsSchemas.js";

import contactController from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactController.getAllContacts);

contactsRouter.get("/:id", contactController.getOneContact);

contactsRouter.delete("/:id", contactController.deleteContact);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  contactController.createContact
);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  contactController.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  validateBody(updateFavorite),
  contactController.updateFavorite
);

export default contactsRouter;
