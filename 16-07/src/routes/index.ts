import { Router } from "express";
import userRoutes from "./user.routes";
import postRoutes from "./post.routes";
import authRoutes from "./auth.routes";
const router = Router();
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/auth", authRoutes);
export default router; // http://localhost:3000/auth/login