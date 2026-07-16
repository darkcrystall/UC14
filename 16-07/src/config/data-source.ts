// importa o "reflect-metadata", que é essencial para o TypeORM funcionar, ele habilita o uso de decorators (@Entity, @Column, etc.) para mapear classes em tabelas do banco. Mapear classes em tabelas significa transformar cada classe do código em uma tabela do banco de dados, onde cada propriedade da classe vira uma coluna e cada objeto vira um registro.
import 'reflect-metadata';
// importa a classe DataSource do TypeORM. O DataSource é a configuração principal de conexão com o banco de dados. Ele sabe qual banco usar, onde conectar, quais entidades existem, etc.
import { DataSource } from 'typeorm';
// importa a biblioteca dotenv, que serve para carregar variáveis de ambiente do arquivo .env. Isso evita colocar senhas e dados sensíveis no código.
import * as dotenv from 'dotenv';
// importa as entidades do projeto. Entidades são as classes que representam tabelas do banco de dados dentro do código, descrevendo seus campos (colunas) e relações com outras tabelas.
import { User } from '../models/User';
import { Post } from '../models/Post';
// carrega as variáveis de ambiente do arquivo .env para o process.env
dotenv.config();
// pegamos as variáveis de ambiente definidas no .env através de destructuring (desestruturação).
const { DB_HOST, DB_PORT, DB_USER, DB_PWD, DB_NAME } = process.env;
// Criamos e exportamos a configuração principal do banco de dados. Quando você cria uma instância de DataSource, você define:
//   - Tipo do banco (mysql, postgres, etc.)
//   - Host, porta, usuário, senha
//   - Quais entidades usar
//   - Se vai sincronizar tabelas automaticamente (synchronize)
export const AppDataSource = new DataSource({
    type: "mysql",
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PWD,
    database: DB_NAME,
    // synchronize: true cria automaticamente as tabelas e colunas com base
    // nas entidades. Útil em desenvolvimento. Em produção deve ser false,
    // para não apagar ou alterar dados automaticamente.
    synchronize: true,
    // logging: true faz o TypeORM mostrar no terminal todos os comandos SQL
    // que ele está executando.
    logging: true,
    // Registramos as entidades (classes que representam tabelas) para que
    // o TypeORM saiba quais existem e crie o mapeamento com o banco.
    entities: [User, Post],
});