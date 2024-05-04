import express from "express";

import ContactController from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();
const jsonParser = express.json();
contactsRouter.get("/", ContactController.getAllContacts);

contactsRouter.get("/:id", ContactController.getOneContact);

contactsRouter.delete("/:id", ContactController.deleteContact);

contactsRouter.post("/", jsonParser, ContactController.createContact);

contactsRouter.put("/:id", jsonParser, ContactController.updateContact);

contactsRouter.patch("/:id/favorite", ContactController.updateFavorite);

export default contactsRouter;
