// Decorators são uma funcionalidade do TypeScript que permitem adicionar
// comportamento extra a classes, métodos ou propriedades de forma
// declarativa, usando o símbolo @. É por causa deles que conseguimos
// transformar classes e propriedades em tabelas e colunas no banco.
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";
// @Entity('users') indica que esta classe representa a tabela "users".
@Entity("users")
export class User {
  // @PrimaryGeneratedColumn() diz ao TypeORM que esta coluna é a chave
  // primária (PK) da tabela, e que o valor dela deve ser gerado
  // automaticamente (auto-incremento).
  @PrimaryGeneratedColumn()
  id: number;
  // @Column define que esta propriedade será uma coluna no banco.
  // length: 100 -> tamanho máximo do campo.
  // nullable: false -> não pode ser nulo.
  @Column({ type: "varchar", length: 150, nullable: false })
  name: string;
  // unique: true garante que o valor será único na tabela (não pode repetir).
  @Column({ type: "varchar", length: 100, unique: true, nullable: false })
  email: string;
  // Guardamos aqui o HASH da senha, nunca a senha em texto puro.
  // select: false faz o TypeORM, por padrão, NUNCA trazer este campo quando
  // fizermos um find() normal. Isso é uma proteção extra: mesmo que alguém
  // esqueça de remover a senha manualmente antes de responder ao cliente,
  // o campo já não vem na consulta por padrão. Só vem se pedirmos explicitamente.
  @Column({ type: "varchar", length: 255, nullable: false, select: false })
  password: string;
  // @OneToMany indica que um 'User' pode ter vários 'Post' (1:N).
  // Precisamos passar dois parâmetros:
  // () => Post -> função que retorna a entidade relacionada.
  // post => post.user -> indica a propriedade em Post que referencia o User.
  // O TypeORM usa isso para criar a relação e a chave estrangeira
  // automaticamente. A outra ponta dessa relação é declarada em Post.
  // Temos que fazer isso sempre para todos os envolvidos, nesse caso, tanto para User quanto para Post
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}