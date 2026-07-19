import { AppError } from "./AppError";
export class NotFoundError extends AppError {
  constructor(field: string) {
    super(`Não encontrado: ${field}`, 404);
  }
}