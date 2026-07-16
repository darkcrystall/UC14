import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
// @Entity('posts') indica que esta classe representa a tabela "posts".
@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  // type -> tipo do campo (se é int, varchar, etc)
  @Column({ type: "varchar", length: 200, nullable: false })
  title: string;
  @Column({ type: "text", nullable: false })
  description: string;
  // @ManyToOne indica que vários posts podem pertencer a um único usuário (N:1).
  // () => User -> função que retorna a entidade relacionada.
  // user => user.posts -> indica a propriedade em User que referencia os posts.
  // O TypeORM usa isso para criar a chave estrangeira automaticamente.
  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  user: User;
}