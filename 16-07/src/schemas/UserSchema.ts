import { z } from "zod";
export const UserSchema = z.object({
  name: z.string().trim().min(1, "O nome não pode ser vazio").optional(),
  email: z.string().trim().email("Email inválido").optional(),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .optional(),
});