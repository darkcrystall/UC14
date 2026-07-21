import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import { CreateUserDTO } from "../schemas/user.schema";

export class NewAuthService {
    private repository: Repository<User> = AppDataSource.getRepository(User);
    async register(data: CreateUserDTO) {
        
    }
}