import { body } from "express-validator";

const add_expense_validation = [
  body("title")
    .notEmpty()
    .withMessage("title cannot be empty")
    .bail()
    .isLength({ min: 3, max: 60 })
    .withMessage("title should be in between 5 to 60 characters"),

  body("amount").notEmpty().withMessage("expense amount is required."),

  body("categoryId")
    .notEmpty()
    .withMessage("catogory is required")
    .bail()
    .isNumeric()
    .withMessage("invalid category id"),
];

const expenseValidations = {
  add_expense_validation,
};

export default expenseValidations;
