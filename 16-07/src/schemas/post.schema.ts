import { z } from "zod";
export const postSchema = z.object({
  title: z.string(),
  description: z.string()
})
export const returnPostSchema = postSchema.array()
export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "O título é obrigatório")
    .max(200, "O título deve ter no máximo 200 caracteres"),

  description: z.string().trim().min(1, "A descrição é obrigatória"),
});
export const updatePostSchema = createPostSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Informe pelo menos um campo para atualizar"
  );
export type CreatePostDTO = z.infer<typeof createPostSchema>;
export type UpdatePostDTO = z.infer<typeof updatePostSchema>;