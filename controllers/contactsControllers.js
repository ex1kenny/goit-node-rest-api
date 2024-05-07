import Contact from "../model/contact.js";
import HttpError from "../helpers/HttpError.js";

async function getAllContacts(req, res, next) {
  try {
    // const { _id: owner } = req.user;
    const contact = await Contact.find();
    res.json(contact);
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
    const result = await Contact.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite,
      owner: req.user._id,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        favorite: req.body.favorite,
        owner: req.user._id,
      },
      { new: true }
    );
    if (!result) {
      throw HttpError(404, "Contact not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  try {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id, owner);

    if (result === null) {
      throw HttpError(404, "Contact not found");
    }
    res.json({ result });
  } catch (error) {
    next(error);
  }
}

async function updateFavorite(req, res, next) {
  try {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const contact = {
      favorite: req.body.favorite,
    };
    const result = await Contact.findByIdAndUpdate(id, contact, owner, {
      new: true,
    });
    if (result === null) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
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
