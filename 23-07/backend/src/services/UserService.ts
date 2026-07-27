import { User } from "../models/User";
import { AppDataSource } from "../config/dataSource";
import { UserMapper } from "../mappers/UserMapper";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../errors";
import bcrypt from "bcryptjs";
import { UpdateUserDTO } from "../dtos/UpdateUserDTO";
import { hashPassword } from "../utils/passwordUtil";

export class UserService {
  private readonly repo = AppDataSource.getRepository(User);

  async findAll(): Promise<Array<Partial<User>>> {
    const users = await this.repo.find();
    return users.map((user) => UserMapper.toResponse(user));
  }

  async getByUserId(id: number): Promise<Partial<User>> {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    return user;
  }

  async getByEmail(email: string): Promise<Partial<User>> {
    const user = await this.repo.findOneBy({ email });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    return user;
  }

  async UpdateUser(id: number, data: UpdateUserDTO): Promise<Partial<User>> {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    const isChangingSensitiveData = !!data.email || !!data.password;

    if (isChangingSensitiveData) {
      if (!data.currentPassword) {
        throw new UnauthorizedError("Informe sua senha atual");
      }

      const passwordMatch = await bcrypt.compare(
        data.currentPassword,
        user.password
      );

      if (!passwordMatch) {
        throw new UnauthorizedError("Senha incorreta");
      }
    }

    if (data.email && data.email !== user.email) {
      const emailAlreadyExists = await this.repo.findOneBy({
        email: data.email,
      });

      if (emailAlreadyExists) {
        throw new ConflictError("Este email já está registrado");
      }
    }

    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    Object.assign(user, data);

    const updatedUser = await this.repo.save(user);

    return UserMapper.toResponse(updatedUser);
  }

  async deleteUser(id: number): Promise<Partial<User>> {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    const usuarioExcluido = await this.repo.remove(user);
    return UserMapper.toResponse(usuarioExcluido);
  }

  async promoveUser(id: number): Promise<Partial<User>> {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    if (user.role === "admin") {
      throw new BadRequestError("Usuário já é administrador");
    }

    user.role = "admin";

    const usuarioPromovido = await this.repo.save(user);
    return UserMapper.toResponse(usuarioPromovido);
  }
}
