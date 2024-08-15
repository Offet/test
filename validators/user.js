// import joi and use for valifation
import Joi from "joi";

export const registerValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  otherNames: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  userName: Joi.string().required(),
  //confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  theme:
    Joi.string() /* this sets the theme of the page to either dark or light*/,
  termsAndConditions: Joi.boolean(),
});

//  validating the user:

// export const validateUser = (user) => {
//     const { error } = userSchema.validate(user);
//     return error;
// };

export const loginValidator = Joi.object({
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().required(),
});

export const createUserValidator = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("admin", "manager").default("user"),
});

export const updateUserValidator = Joi.object({
  name: Joi.string(),
  role: Joi.string().valid("admin", "manager"),
});
