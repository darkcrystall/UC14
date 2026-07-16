import { NextFunction, Request, Response } from "express";

export function validateUserUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password } = req.body;
  if (name === "" || email === "" || password === "") {
    return res
      .status(490)
      .json({ message: "Não é possível atualizar com um campo vazio" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "A senha deve ter pelo menos 6 caracteres" });
  }
  next();
}