// esta função servirá para remover o campo de senha (password) de um objeto User. isso vai fazer com que, quando chamamrmos ele em services, ele envia ao banco o usuário normal (completo), mas envia para o controller um usuário que não tem senha, assim o JSON não contém a senha do usuário
import { User } from "../models/User";
export function omitPassword(user: User) {
  // copiamos o valor da senha do user para a variável password, assim o resto (id, name, email) fica dentro da variável rest e é ela que é retornada
  const { password, ...rest } = user;
  return rest;
}