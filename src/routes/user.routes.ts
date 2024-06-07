import { Router } from "express";
import { login, signup } from "../controllers/user.controller";
import { userValidations } from "../validations/user.validation";

const userRouter = Router();

userRouter.post("/register", userValidations.user_signup_validation, signup);
userRouter.post("/login", userValidations.user_login_validation, login);

export default userRouter;
