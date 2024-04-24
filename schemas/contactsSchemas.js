import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .pattern(new RegExp(/^[a-zA-Z0-9\s\-]+$/)),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});
export const updateContactSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(30)
    .pattern(new RegExp(/^[a-zA-Z0-9\s\-]+$/))
    .required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
})
  .min(1)
  .messages({
    "object.min": "Body must have at least one field",
  });
