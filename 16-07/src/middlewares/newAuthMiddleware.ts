import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export function newAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if(!token) {
        throw new UnauthorizedError();
    }
    return next();
}