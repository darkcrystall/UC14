import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../auth/jwt";
// middleware para proteger rotas que exigem autenticação
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // no objeto da requisição, ele vai até o header e verifica o que tem dentro de authorization
  const authorization = req.headers.authorization;
  // se não houver header, retorna erro 401 (UNAUTHORIZED)
  if (!authorization) {
    return res.status(401).json({
      message: "Sem autorização: token não fornecido.",
    });
  }
  // o token vem neste formato:
  // Authorization: Bearer tokenAqui
  // split() divide uma string em duas ou mais partes, usando um delimitador em parênteses
  const parts = authorization.split(" ");
  // Se não tiver exatamente duas partes, está mal formatado
  if (parts.length !== 2) {
    return res.status(401).json({
      message: "Sem autorização: token mal formatado.",
    });
  }
  const [scheme, token] = parts;
  // a primeira parte precisa ser Bearer
  if (scheme !== "Bearer") {
    return res.status(401).json({
      message: "Sem autorização: formato do token inválido.",
    });
  }
  // verifica se o token é válido
  const decoded = verifyToken(token);
  // se o token for inválido ou expirado, bloqueia
  if (!decoded) {
    return res.status(401).json({
      message: "Sem autorização: token inválido ou expirado.",
    });
  }
  // guardamos os dados decodificados dentro do req, a tipo normal dele não permite por não ter o atributo user, então o transformamaos temporariamente em any
  // assim, outros controllers poderiam saber quem é o usuário logado
  (req as any).user = decoded;
  // se chegou até aqui, está tudo certo
  // então deixamos a requisição seguir
  next();
}