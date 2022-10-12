export {};
import * as Joi from 'joi';
import { User } from '../../api/models';

const requireEmail = () => Joi.string().email().required();

const postPutBody = () => {
  return {
    email: requireEmail(),
    password: Joi.string().min(6).max(128).required(),
    name: Joi.string().max(128),
    role: Joi.string().valid(User.roles),
  };
};

module.exports = {
  // GET 1/users
  listUsers: {
    query: {
      limit: Joi.number().min(1).max(9999),
      offset: Joi.number().min(0),
      page: Joi.number().min(0),
      perPage: Joi.number().min(1),
      sort: Joi.string(),
      name: Joi.string(),
      email: Joi.string(),
      role: Joi.string().valid(User.roles),
    },
  },

  // POST /users
  createUser: {
    body: postPutBody(),
  },

  // PUT /users/:userId
  replaceUser: {
    body: postPutBody(),
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
};
