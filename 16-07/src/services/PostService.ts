import { NotFoundError } from "../errors/NotFoundError";
import { PostRepository } from "../repositories/PostRepository";
import { UserRepository } from "../repositories/UserRepository";
import { CreatePostDTO, UpdatePostDTO } from "../schemas/post.schema";
import { omitPassword } from "../utils/omitPassword";
import { UnauthorizedError } from "../errors/UnauthorizedError";
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
      throw new NotFoundError("postagens");
    }

    return posts.map((post) => ({
      ...post,
      user: omitPassword(post.user),
    }));
  },

  async findByPostId(id: number) {
    const post = await PostRepository.findByPostId(id);

    if (!post) {
      throw new NotFoundError("postagem");
    }

    return {
      ...post,
      user: omitPassword(post.user),
    };
  },

  async listMyPosts(userId: number) {
    const posts = await PostRepository.findByUserId(userId);

    return posts.map((post) => ({
      ...post,
      user: omitPassword(post.user),
    }));
  },

  async create(data: CreatePostDTO, loggedUserId: number) {
    const user = await UserRepository.findById(loggedUserId);

    if (!user) {
      throw new NotFoundError("usuário");
    }

    const post = await PostRepository.create(data, user);

    return {
      ...post,
      user: omitPassword(post.user),
    };
  },

  async update(id: number, data: UpdatePostDTO, loggedUserId: number) {
    const post = await PostRepository.findByPostId(id);

    if (!post) {
      throw new NotFoundError("postagem");
    }

    if (post.user.id !== loggedUserId) {
      throw new UnauthorizedError();
    }

    const updatedPost = await PostRepository.update(id, data);

    if (!updatedPost) {
      throw new NotFoundError("postagem");
    }

    return {
      ...updatedPost,
      user: omitPassword(updatedPost.user),
    };
  },

  async delete(id: number, loggedUserId: number) {
    const post = await PostRepository.findByPostId(id);

    if (!post) {
      throw new NotFoundError("postagem");
    }

    if (post.user.id !== loggedUserId) {
      throw new UnauthorizedError();
    }

    await PostRepository.delete(id);
  },
};