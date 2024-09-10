import Contact from "../model/contact.js";
import HttpError from "../helpers/HttpError.js";

async function getAllContacts(req, res, next) {
  try {
    const { _id: owner } = req.user;

    const contacts = await Contact.find({ owner });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
}

async function getOneContact(req, res, next) {
  try {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const contact = await Contact.findById(id, owner);
    if (!contact) throw HttpError(404, "Contact not found");

    res.json(contact);
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  try {
    const { name, email, phone, favorite } = req.body;
    const owner = req.user._id;
    const contact = await Contact.create({
      name,
      email,
      phone,
      favorite,
      owner,
    });
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, phone, favorite } = req.body;
    const owner = req.user._id;
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, email, phone, favorite, owner },
      { new: true }
    );
    if (!updatedContact) {
      throw HttpError(404, "Contact not found");
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const deletedContact = await Contact.findOneAndDelete({ _id: id, owner });
    if (!deletedContact) {
      throw HttpError(404, "Contact not found");
    }
    res.json({ result: deletedContact });
  } catch (error) {
    next(error);
  }
}

async function updateFavorite(req, res, next) {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const owner = req.user._id;
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      { new: true }
    );
    if (!updatedContact) {
      throw HttpError(404, "Contact not found");
    }
    res.json(updatedContact);
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
