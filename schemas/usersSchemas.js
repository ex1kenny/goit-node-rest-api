import Joi from "joi";

export const usersAuthSchema = Joi.object()
  .options({})
  .keys({
    password: Joi.string().min(4).max(25).required(),
    email: Joi.string().email().required(),
  });
