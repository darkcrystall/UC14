import { Router } from "express";
import { PostController } from "../controllers/PostController";
import { validateId } from "../middlewares/validateId";
import { authMiddleware } from "../middlewares/authMiddleware";
const postRoutes = Router();
const postController = new PostController();
// POST ROUTES
postRoutes.get("/", postController.listAll.bind(postController));
postRoutes.post(
  "/",
  authMiddleware,
  postController.create.bind(postController)
);
postRoutes.get(
  "/myposts",
  authMiddleware,
  postController.listMyPosts.bind(postController)
);
postRoutes.get(
  "/:userName",
  authMiddleware,
  postController.findByUserName.bind(postController)
);
postRoutes.put(
  "/:id",
  authMiddleware,
  validateId,
  postController.update.bind(postController)
);
postRoutes.delete(
  "/:id",
  authMiddleware,
  validateId,
  postController.delete.bind(postController)
);
export default postRoutes;