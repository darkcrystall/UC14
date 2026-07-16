import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import { omitPassword } from "../utils/omitPassword";
import { generateToken } from "../utils/jwt";
// a camada Service é responsável por chamar os métodos do repository e cuidar das validações das nossas regras de negócio (ex: um usuário precisa de um email válido, etc)
// aqui estamos criando uma classe de erro que extende a classe Error. Isso é para permitir que, mais tarde, o Controller identifique o tipo de erro de uma forma mais clara
export class NotFoundError extends Error {}
export class UnauthorizedError extends Error {} // erro de não autorizado
export const UserService = {
  // como para listar não precisamos validar nada, aqui só chamamos o método repository, pois o controller não pode se comunicar diretamente com o repository, apenas com a service
  async listAll() {
    return UserRepository.findAll();
  },
  async getById(id: number) {
    const user = await UserRepository.findById(id);
    // aqui vai nossa primeira validação: se não encontrarmos um user com esse id, ele não existe. se não existe, lança um erro
    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }
    // se encontrou, não cai no "if", então podemos usar o return e retornar o user
    return user;
  },
  async create(data: { name: string; email: string; password: string }) {
    // este método gera uma senha criptografada
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // isso gera um objeto que é assim:
    /* const user = {
        name: "Usuário",
        email: "email@teste.com",
        password: "senhaComHash"
    } */
    const user = await UserRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });
    // chamamos o método de omitPassword, que retorna sem mostrar a senha
    return omitPassword(user);
  },
  // método de login
  async login(data: { email: string; password: string }) {
    const user = await UserRepository.findByEmailWithPassword(data.email);
    if (!user || !data.password) {
      throw new NotFoundError("Usuário não encontrado");
    }
    const passwordIsValid = await bcrypt.compare(data.password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedError("Senha inválida");
    }
    const token = generateToken({ id: user.id, email: user.email });
    return { user: omitPassword(user), token };
  },
  // atualiza um usuário existente
  async update(
    id: number,
    data: { name?: string; email?: string; password?: string }
  ) {
    // reaproveitamos o getById, pos já busca o usuário e já lança NotFoundError se não existir
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }
    // é necessário alterar/atualizar apenas os campos que vieram, assim podemos atualizar apenas um campo
    if (data.name) {
      user.name = data.name;
    }
    if (data.email) {
      user.email = data.email;
    }
    // caso vier uma nova senha, é necessário criptografá-la novamente. do contrário, mantemos a antiga
    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }
    // depois, chamamos o método create do repository (ele salva no banco)
    const updatedUser = await UserRepository.create(user);
    // retorna o usuário com a senha oculta
    return omitPassword(updatedUser);
  },
  // deleta um usuário
  async delete(id: number) {
    const result = await UserRepository.delete(id);
    if (result.affected === 0) {
      throw new Error("Usuário não encontrado");
    }
  },
};
