import Joi from 'src/plugins/joi';

export const userCreateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
});
