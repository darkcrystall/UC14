import { AppError } from "./AppError";
export class UnauthorizedError extends AppError {
  constructor() {
    super("Não autorizado", 401);
  }
}