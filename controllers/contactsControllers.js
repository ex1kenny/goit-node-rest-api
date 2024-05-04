
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import Contact from "../model/contact.js";
import HttpError from "../helpers/HttpError.js";
async function getAllContacts(req, res, next) {
  try {
    const contact = await Contact.find();
    res.send(contact);
  } catch (error) {
    next(error);
  }
}

async function getOneContact(req, res, next) {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);
    if (contact === null) {
      throw HttpError(404, "Contact not found");
    }
    res.send(contact);
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  const validate = await createContactSchema.validateAsync(req.body);
  if (validate.error) {
    throw HttpError(400, { message: validate.error.message });
  }

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };
  try {
    const result = await Contact.create(contact);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  const validate = await updateContactSchema.validateAsync(req.body);
  if (validate.error) {
    throw HttpError(400, { message: validate.error.message });
  }
  const { id } = req.params;
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };
  try {
    const result = await Contact.findByIdAndUpdate(id, contact, { new: true });
    if (result === null) {
      throw HttpError(404, "Contact not found");
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  const { id } = req.params;
  try {
    const result = await Contact.findByIdAndDelete(id);

    if (result === null) {
      throw HttpError(404, "Contact not found");
    }
    res.send({ id });
  } catch (error) {
    next(error);
  }
}

async function updateFavorite(req, res, next) {
  const { id } = req.params;
  const contact = {
    favorite: req.body.favorite,
  };
  try {
    const result = await Contact.findByIdAndUpdate(id, contact, { new: true });
    if (result === null) {
      throw HttpError(404, "Not found");
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
}
export default {
  updateContact,
  createContact,
  getOneContact,
  getAllContacts,
  deleteContact,
  updateFavorite,
};
