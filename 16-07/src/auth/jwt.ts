// esse arquivo será responsável pelos métodos para gera gerar e verificar os tokens
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { IPayload } from "./IPayload";
dotenv.config();
// método chamado quando é necessário gerar um token (quando logarmos no sistema)
export function generateToken(payload: IPayload) {
  // o método sign() da biblioteca da JWT gera um token. é necessário três argumentos: as informações do usuário (payload), o "segredo" da chave e um objeto que contém a opção "expiresIn" cujo valor será a variável JWT_EXPIRES_IN (em quanto tempo a chave expirará)
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: Number(process.env.JWT_EXPIRES_IN) });
}
// função que cerifica se um token é válido
export function verifyToken(token: string) {
  try {
    // para saber se é válido, usamos verify() da JWT. é necessário dois argumentos: o token e o "segredo" da chave. se for válido, ele retorna o próprio token, se não for retorna null
    return jwt.verify(token, process.env.JWT_SECRET!) as IPayload;
  } catch (error) {
    return null;
  }
}