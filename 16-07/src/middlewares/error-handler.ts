import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { BadRequestError } from "../errors/BadRequestError";
export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Erro capturado pelo error-handler: " + error);
    if (error instanceof BadRequestError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }
  return res.status(500).json({ message: "Erro interno do servidor" });
}
