import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller";

const categoryRouter = Router();

categoryRouter.get("/", isAuthenticated, getCategories);
categoryRouter.post("/", isAdmin, addCategory);
categoryRouter.put("/", isAdmin, updateCategory);
categoryRouter.delete("/:id", isAdmin, deleteCategory);

export default categoryRouter;
