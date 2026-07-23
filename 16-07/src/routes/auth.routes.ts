import { Router } from "express";
import { NewAuthController } from "../controllers/NewAuthController";
import { NewAuthMiddleware } from "../middlewares/newAuthMiddleware";
const authRoutes = Router();
const authController = new NewAuthController();
authRoutes.post("/login", authController.login.bind(authController));
authRoutes.post("/logout", NewAuthMiddleware, authController.logout.bind(authController));
authRoutes.post("/checkpass", NewAuthMiddleware, authController.checkUserPassword.bind(authController));
export default authRoutes;