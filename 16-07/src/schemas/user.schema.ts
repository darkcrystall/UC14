import { z } from "zod";
const nameSchema = z
  .string()
  .trim()
  .min(3, "O nome deve ter pelo menos 3 caracteres")
  .max(100, "O nome deve ter no máximo 100 caracteres");
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Email inválido");
const passwordSchema = z
  .string()
  .min(8, "A senha  é muito curta")
  .max(255, "A senha é muito longa");
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});
export const updateUserSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "Informe pelo menos um campo para atualização"
  );
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Senha obrigatória"),
});
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type LoginUserDTO = z.infer<typeof loginSchema>;