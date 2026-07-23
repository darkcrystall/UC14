import { z } from "zod";
import { returnPostSchema } from "./post.schema";
const nameSchema = z
  .string()
  .trim()
  .min(3, "O nome deve ter pelo menos 3 caracteres")
  .max(100, "O nome deve ter no máximo 100 caracteres");
const emailSchema = z.email("Email inválido").trim();
const passwordSchema = z
  .string()
  .min(6, "A senha  é muito curta")
  .regex(/^(?=.*[A-Z])/, "A senha deve ter pelo menos uma letra maiúscula")
  .regex(/^(?=.*[a-z])/, "A senha deve ter pelo menos uma letra minúscula")
  .regex(/^(?=.*[0-9])/, "A senha deve ter pelo menos um dígito")
  .regex(/^(?=.*[@%!&*_])/, "A senha deve ter pelo menos um símbolo")
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
// export const returnUserSchema = z.object({
//   id: z.number(),
//   name: nameSchema,
//   email: emailSchema,
//   posts: returnPostSchema,
// });
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type LoginUserDTO = z.infer<typeof loginSchema>;
// export type ReturnUserDTO = z.infer<typeof returnUserSchema>;