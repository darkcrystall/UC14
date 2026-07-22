import { Router } from "express";
import { NewAuthController } from "../controllers/NewAuthController";
const authRoutes = Router();
const authController = new NewAuthController();
authRoutes.post("/login", authController.login.bind(authController));
authRoutes.post("/logout", authController.logout.bind(authController));
authRoutes.post("/checkpass", authController.checkUserPassword.bind(authController));
export default authRoutes;