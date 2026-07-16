import { NextFunction, Request, Response } from "express";

// esse middleware vai formatar cada resposta de erro. ao invés de cada controller ter que pegar um erro e formatar a mensagem, ele faz isso para todos
export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  // antes de mais nada, a gente mostra o errro "na forma original" dele pra debugar
  console.log("Erro capturado pelo errorHandler: " + error);
  // o "ER_DUP_ENTRY" é específico da MySQL. ele acontece quando é enviado para o banco um campo que possui unique que já exista, como criar um usuário com email duplicado
  if (error.code === "ER_DUP_ENTRY") {
    // 409: CONFLICT
    return res
      .status(409)
      .json({ message: "Registro duplicado (e-mail já cadastrado)" });
  }
  // se for qualquer outro erro, retorna um erro genérico
  return res.status(500).json({ message: "Erro interno do servidor" });
}