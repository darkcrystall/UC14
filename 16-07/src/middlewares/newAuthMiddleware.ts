import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../auth/jwt";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export function NewAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;

  if (!token) {
    throw new UnauthorizedError();
  }

  try {
    const payload = verifyToken(token);
    if (!payload) {
      throw new UnauthorizedError();
    }
    req.user = payload;

    next();
  } catch {
    throw new UnauthorizedError();
  }
}