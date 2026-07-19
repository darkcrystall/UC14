import { AppError } from "./AppError";
export class ConflictError extends AppError {
  constructor(field: string, value?: string) {
    super(value ? `${field} '${value}' já está em uso` : `${field} já está em uso`, 409);
  }
}