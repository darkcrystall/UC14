import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validateId } from "../middlewares/validateId";
import { validateUserCreate, validateUserUpdate } from "../middlewares/validateUser";
import { authMiddleware } from "../middlewares/authMiddleware";
const userRoutes = Router();
const userController = new UserController();
// USER ROUTES
// para criar uma rota, usamos o objeto router e passamos como parâmetroso caminho e o objeto do controlador que vai ser executado, e os middlewares, se necessário
// .bind(userController) garante que o "this" dentro do método continue apontando pra instância certa quando o Express chamar essa função
userRoutes.get("/", authMiddleware, userController.list.bind(userController));
userRoutes.get(
  "/:id",
  authMiddleware,
  validateId,
  userController.getById.bind(userController)
);
// validateUser roda primeiro: se os dados estiverem inválidos, a requisição já é interrompida ali, sem nem chegar ao Controller
// a rota de criar novo usuário não precisa de autenticação
userRoutes.post(
  "/",
  validateUserCreate,
  userController.create.bind(userController)
);
userRoutes.put(
  "/:id",
  authMiddleware,
  validateId,
  validateUserUpdate,
  userController.update.bind(userController)
);
userRoutes.delete(
  "/:id",
  authMiddleware,
  validateId,
  userController.delete.bind(userController)
);
export default userRoutes;