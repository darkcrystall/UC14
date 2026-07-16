import { PostRepository } from "../repositories/PostRepository";
import { UserRepository } from "../repositories/UserRepository";
import { omitPassword } from "../utils/omitPassword";
export class NotFoundError extends Error {}
export class ForbiddenError extends Error {}
export const PostService = {
  async listAll() {
    const posts = await PostRepository.findAll();
    return posts.map((post) => ({
      ...post,
      user: omitPassword(post.user),
    }));
  },
  async findByUserName(userName: string) {
    const posts = await PostRepository.findByUserName(userName);
    if (posts.length === 0) {
      throw new Error("Nenhuma postagem encontrada");
    }
    return posts.map((post) => ({
      ...post,
      user: omitPassword(post.user),
    }));
  },
  async findByPostId(id: number) {
    const post = await PostRepository.findByPostId(id);
    if (!post) {
      throw new Error("Não encontrado");
    }
    return { ...post, user: omitPassword(post.user) };
  },
  async listMyPosts(userId: number) {
    const posts = await PostRepository.findByUserId(userId);
    return posts.map((post) => ({ ...post, user: omitPassword(post.user) }));
  },
  async create(data: { title: string }, loggedUserId: number) {
    if (!data.title) {
      throw new Error("É obrigatório especificar todos os campos");
    }
    const createdBy = await UserRepository.findById(loggedUserId);
    if (!createdBy) {
      throw new NotFoundError("Usuário inexistente");
    }
    const post = await PostRepository.create({
      title: data.title,
      user: createdBy,
    });
    return { ...post, user: omitPassword(post.user) };
  },
  async update(id: number, data: { title?: string }, loggedUserId: number) {
    const post = await PostRepository.findByPostId(id);
    if (!post) {
      throw new NotFoundError("Postagem não encontrada");
    }
    const updatedBy = await UserRepository.findById(loggedUserId);
    if (!updatedBy) {
      throw new NotFoundError("Usuário não encontrado")
    }
    // só o dono do post pode editar
    if (post.user.id !== loggedUserId) {
      throw new ForbiddenError("Não autorizado");
    }
    if (data.title) {
      post.title = data.title;
    }
    return await PostRepository.update(id, {
      title: data.title,
      user: updatedBy,
    });
  },
  async delete(id: number, loggedUserId: number) {
    const post = await PostRepository.findByPostId(id);
    if (!post) {
      throw new NotFoundError("Postagem não encontrada")
    }
    if (post.user.id !== loggedUserId) {
      throw new ForbiddenError("Não autorizado")
    }
    return await PostRepository.delete(post.id);
  },
};