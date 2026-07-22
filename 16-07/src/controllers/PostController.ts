import { NextFunction, Request, Response } from "express";
import { PostService } from "../services/PostService";
import { BadRequestError } from "../errors/BadRequestError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import {
  CreatePostDTO,
  createPostSchema,
  UpdatePostDTO,
  updatePostSchema,
} from "../schemas/post.schema";
export class PostController {
  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await PostService.listAll();
      return res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }
  async findByUserName(req: Request, res: Response, next: NextFunction) {
    try {
      const { userName } = req.params;
      if (typeof userName !== "string") {
        throw new BadRequestError("nome de usuário");
      }
      const posts = await PostService.findByUserName(userName);
      return res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }
  async findByPostId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const post = await PostService.findByPostId(id);
      return res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
  async listMyPosts(req: Request, res: Response, next: NextFunction) {
    try {
      // as informações do usuário que esá logado vem da requisição através do token
      const loggedUser = req.user;
      // lista os posts do usuário logado
      if (!loggedUser) {
        throw new UnauthorizedError();
      }
      const myPosts = await PostService.listMyPosts(loggedUser.id);
      return res.status(200).json(myPosts);
    } catch (error) {
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const postData: CreatePostDTO = createPostSchema.parse(req.body);
      const loggedUser = req.user;
      if (!loggedUser) {
        throw new UnauthorizedError();
      }
      const post = await PostService.create(postData, loggedUser.id);
      return res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const postData: UpdatePostDTO = updatePostSchema.parse(req.body);
      const loggedUser = req.user;
      if (!loggedUser) {
        throw new UnauthorizedError();
      }
      await PostService.update(id, postData, loggedUser.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user;
      if (!loggedUser) {
        throw new UnauthorizedError();
      }
      await PostService.delete(id, loggedUser.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}