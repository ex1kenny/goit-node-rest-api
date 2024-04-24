import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  changeContact,
} from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const data = await listContacts();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getContactById(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await removeContact(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {}
};

export const createContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const validate = await createContactSchema.validateAsync(req.body);
    if (validate.error) {
      return res.status(400).json({ message: validate.error.message });
    }
    const data = await addContact({ id, name, email, phone });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const validate = await updateContactSchema.validateAsync(req.body);
    if (validate.error) {
      return res.status(400).json({ message: validate.error.message });
    }
    const updatedContact = await changeContact(id, { name, email, phone });
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(updatedContact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
