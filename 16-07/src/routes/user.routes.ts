import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validateUserCreate, validateUserUpdate } from "../middlewares/validateUser";
import { NewAuthMiddleware } from "../middlewares/newAuthMiddleware";
const userRoutes = Router();
const userController = new UserController();
// USER ROUTES
// para criar uma rota, usamos o objeto router e passamos como parâmetroso caminho e o objeto do controlador que vai ser executado, e os middlewares, se necessário
// .bind(userController) garante que o "this" dentro do método continue apontando pra instância certa quando o Express chamar essa função
userRoutes.get("/", userController.list.bind(userController));
userRoutes.get(
  "/logged",
  NewAuthMiddleware,
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
  "/update",
  NewAuthMiddleware,
  validateUserUpdate,
  userController.update.bind(userController)
);
userRoutes.delete(
  "/delete",
  NewAuthMiddleware,
  userController.delete.bind(userController)
);
export default userRoutes;