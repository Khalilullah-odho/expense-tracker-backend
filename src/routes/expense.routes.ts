import { Router } from "express";
import {
  addExpense,
  deleteExpense,
  getAllExpenses,
  updateExpense,
} from "../controllers/expense.controller";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";
import expenseValidations from "../validations/expense.validation";

const expenseRouter = Router();

expenseRouter.get("/", isAuthenticated, getAllExpenses);
expenseRouter.post(
  "/",
  isAuthenticated,
  expenseValidations.add_expense_validation,
  addExpense
);

expenseRouter.put(
  "/",
  isAuthenticated,
  expenseValidations.add_expense_validation,
  updateExpense
);
expenseRouter.get("/:id", isAuthenticated, getAllExpenses);
expenseRouter.delete("/:id", isAuthenticated, deleteExpense);

export default expenseRouter;
