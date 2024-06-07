import { body } from "express-validator";

const user_signup_validation = [
  body("fullName")
    .notEmpty()
    .withMessage("fullname cannot be empty")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("fullname should be in between 3 to 30 characters"),

  body("email")
    .notEmpty()
    .withMessage("email cannot be empty")
    .bail()
    .isEmail()
    .withMessage("invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("password cannot be  empty")
    .bail()
    .isLength({ min: 8 })
    .withMessage("password must be 8 characters long"),
];

const user_login_validation = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("invalid email address"),

  body("password").notEmpty().withMessage("password is required"),
];

export const userValidations = {
  user_signup_validation,
  user_login_validation,
};
