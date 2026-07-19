import { AppDataSource } from "../config/data-source";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { CreatePostDTO, UpdatePostDTO } from "../schemas/post.schema";
const repo = AppDataSource.getRepository(Post);
export const PostRepository = {
  async findAll() {
    return repo.find({
      relations: {
        user: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        user: {
          id: true,
          name: true,
        },
      },
    });
  },
  async findByPostId(id: number) {
    return repo.findOne({ where: { id }, relations: { user: true } });
  },
  async findByUserName(userName: string) {
    return repo.find({
      where: { user: { name: userName } },
      relations: { user: true },
    });
  },
  async findByUserId(userId: number) {
    return repo.find({
      where: { user: { id: userId } },
      relations: { user: true },
    });
  },
  async create(data: CreatePostDTO, user: User) {
    const post = repo.create({
      ...data,
      user,
    });
    return repo.save(post);
  },
  async update(id: number, data: UpdatePostDTO) {
    await repo.update(id, data);
    return this.findByPostId(id);
  },
  async delete(id: number) {
    return repo.delete(id);
  },
};