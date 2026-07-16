import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      // chama o Service para fazer a regra de login
      const result = await UserService.login({
        email,
        password,
      });
      // se deu certo, retornamos usuário sem senha + token
      return res.json(result);
    } catch (error) {
      // se deu erro, mandamos para o errorHandler
      next(error);
    }
  }
}