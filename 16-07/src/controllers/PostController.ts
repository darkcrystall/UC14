import { NextFunction, Request, Response } from "express";
import { PostService } from "../services/PostService";
import { BadRequestError } from "../errors/BadRequestError";
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
      const loggedUser = (req as any).user;
      // lista os posts do usuário logado
      const myPosts = await PostService.listMyPosts(loggedUser.id);
      return res.status(200).json(myPosts);
    } catch (error) {
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description } = req.body;
      const loggedUser = (req as any).user;
      const post = await PostService.create(
        { title, description },
        loggedUser.id
      );
      return res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { title } = req.body;
      const loggedUser = (req as any).user;
      await PostService.update(id, { title }, loggedUser.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = (req as any).user;
      await PostService.delete(id, loggedUser.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}