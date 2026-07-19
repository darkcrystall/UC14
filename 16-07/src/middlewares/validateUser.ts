import {
  createUserSchema,
  loginSchema,
  updateUserSchema,
} from "./../schemas/user.schema";
import { NextFunction, Request, Response } from "express";
import z, { ZodType } from "zod";
import { BadRequestError } from "../errors/BadRequestError";
function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new BadRequestError(
        result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }))
      );
    }
    req.body = result.data;
    next();
  };
}
export const validateUserCreate = validate(createUserSchema);
export const validateUserUpdate = validate(updateUserSchema);
export const validateUserLogin = validate(loginSchema);