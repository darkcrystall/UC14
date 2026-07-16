import { Request, Response, NextFunction } from "express";
export function validateId(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }
  next();
}