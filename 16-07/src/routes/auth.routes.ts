import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateUserLogin } from "../middlewares/validateUser";
const authRoutes = Router();
const authController = new AuthController();
authRoutes.post("/login", validateUserLogin, authController.login.bind(authController));
export default authRoutes;