import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
// um repository (repositório) é um objeto do TypeORM que contém várias funções necessárias para trabalhar com o banco de dados.
// Pegamos o repositório padrão do TypeORM para a entidade User.
// Esse repositório já sabe fazer find, save, delete, etc, mas vamos
// "envelopar" ele em funções com nomes que fazem mais sentido para as
// regras do nosso projeto.
const repo = AppDataSource.getRepository(User);
export const UserRepository = {
  // vamos criar os métodos que fazem o CRUD do usuário
  // busca todos os usuários
  async findAll() {
    // o método find() vem do TypeORM. Ele procura algo em uma tabela, aceita como parâmetro um objeto com opções para essa busca. Nesse caso, estamos buscando também os posts relacionados a um usuário, ou seja, quando buscarmos um usuário qualquer, o servidor também vai retornar no JSON todos os posts que pertencem a ele. Aqui, retorna todos os usuários com todos os seus posts
    return repo.find({ relations: { posts: true }});
  },
  // busca um único usuário pelo id, também trazendo os posts relacionados a ele
  async findById(id: number) {
    return repo.findOne({ where: { id }, relations: { posts: true } });
  },
  // busca por e-mail, para ser utilizado ao logar
  async findByEmailWithPassword(email: string) {
    return repo.findOne({
      where: { email },
      select: { id: true, name: true, password: true },
    });
  },
  async create(data: { name: string; email: string; password: string }) {
    // cria o usuário
    const user = repo.create(data);
    // salva o usuário o banco
    return repo.save(user);
  },
  // deleta um usuário
  // delete retorna um objeto com informação sobre quantas linhas foram
  // afetadas (result.affected), que o Service usa pra saber se realmente
  // existia um usuário com esse id
  async delete(id: number) {
    return repo.delete(id);
  },
};