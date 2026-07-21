import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { BadRequestError } from "../errors/BadRequestError";
import { ZodError } from "zod";
export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(`${error}`);
  // if (error instanceof ZodError) {
  //   return res.status(400).json({
  //     errors: error.flatten(),
  //   });
  // }
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
