import { Joi, Segments } from 'celebrate';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().min(2).max(32).required(),
    email: Joi.string().email().lowercase().max(64).required(),
    password: Joi.string().min(8).max(64).required(),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().lowercase().max(64).required(),
    password: Joi.string().min(8).max(64).required(),
  }),
};
