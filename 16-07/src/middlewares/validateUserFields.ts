import { Request, Response, NextFunction } from "express";
import { UserSchema } from "../schemas/UserSchema";
export function validateUserFields(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = UserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues.map((issue) => issue.message),
    });
  }
  next();
}