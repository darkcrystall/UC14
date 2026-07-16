import { Request, Response, NextFunction } from "express";
// ele valida se nome, email e senha foram preenchidos corretamente
export function validateUser(req: Request, res: Response, next: NextFunction) {
  // pega os dados que vieram do corpo da requisição
  const { name, email, password } = req.body;
  // valida os campos
  if (!name || !email || !password) {
    // 400: BAD REQUEST (requisição mal formada)
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }
  // senha não pode ter menos de 6 caracteres
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "A senha deve ter pelo menos 6 caracteres" });
  }
  // se passou todas verificações, então deixamos a requisição seguir adiante e passar para a camada controller
  next();
}