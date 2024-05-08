import Joi from "joi";

export const usersAuthloginSchema = Joi.object()
  .options({})
  .keys({
    password: Joi.string().min(4).max(25).required(),
    email: Joi.string().email().required(),
  });

export const usersAuthRegisterSchema = Joi.object()
  .options({})
  .keys({
    password: Joi.string().min(4).max(25).required(),
    email: Joi.string().email().required(),
    subscription: Joi.string().optional(),
  });
