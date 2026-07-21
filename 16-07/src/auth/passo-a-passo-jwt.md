### JWT

JWT significa **JSON Web Token**. rata-se de um token gerado pelo servidor e armazenado no cliente (normalmente no navegador) que contém informações sobre o usuário autenticado.

Codifica um JSON:
```json
{ id: 1, email: "teste@teste.com" }
```
Usando Base64URL e depois gera uma assinatura criptográfica:
```json
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6MSwiZW1haWwiOiJ0ZXN0ZUB0ZXN0ZS5jb20ifQ.
arydo0SQP2rc8aepBYntEy4TYl79hRGbHFbHU7epnR4
```

Permite identificar qual usuário está logado sem a necessidade de realizar uma nova autenticação a cada requisição. Além disso, permite controlar permissões, garantindo que um usuário possa criar, atualizar ou excluir apenas os próprios recursos.

Um JWT é dividido em três partes, o qual são delimitadas pelos pontos. Elas, por ordem, são:

**Header**: contém informações sobre o tipo do token e o algoritmo utilizado.

**Payload**: contém os dados armazenados no token, como `id` e `email`.

**Signature**: assinatura gerada a partir do conteúdo do token e de uma chave secreta exclusiva da aplicação. Ela garante a integridade e autenticidade do token, pois cada um é único e específico por sistema.

--- 

Para utilizá-lo:

1. É necessário instalar as dependências:
```bash
npm i jsonwebtoken
npm i @types/jsonwebtoken
```

1. Criar o arquivo `jwt.ts` na pasta `utils`

2.1. Importar os módulos necessários 
```ts
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
```
2.2. Carregar as váriaveis do .env, para o objeto process.env
```ts
dotenv.config();
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
``` 
2.3. No env., é necessário ter as variáveis correspondentes
```json
// variáveis
JWT_SECRET=chave // senha para criar a signature
JWT_EXPIRES_IN=86400 // tempo em segundos que o token expirará
```
2.4. No arquivo `jwt.ts`, teremos a interface Payload que determina o que a chave esperará receber nesse campo
```ts
interface Payload { id: number; email: string }
```
2.5. Cria-se a função que gera um token
```ts
export function generateToken(payload: Payload) {
    // o método sign() assina um token. precisa de três argumentos, nessa ordem: o Payload, a Signature do sistema e um objeto que contém o atributo expiresIn, que espera um valor dos segundos que o token expirará  
    return jwt.sign(payload, JWT_SECRET!, { expiresIn: Number(JWT_EXPIRES_IN) });
}
```
2.6. Cria-se a função que verifica um token
```ts
export function verifyToken(token: string) {
    try {
        // o método verify() irá analisar o token. precisa de dois argumentos, nessa ordem: o token e a Signature do sistema
        return jwt.verify(token, JWT_SECRET!);
    } catch {
        return null;
    }
}
```

3. Cria-se uma função que consegue fazer uma busca única, um exemplo é buscar por e-mail.
```ts
async findByEmail(email: string) {
    return repo.findOne({ where: { email }});
}
```

4. No arquivo `UserService.ts` da camada Service:

4.1. Adicionar uma extensão da classe `Error`, chamando-a de `UnauthorizedError`

```ts
export class UnauthorizedError extends Error {}
```

4.2. Adicionar método de login, que valida o usuário pelo e-mail e senha desse usuário

```ts
async login(data: { email: string, password: string }) {
    const user = await UserRepository.findByEmail(data.email);
    const isCorrect = await bcrypt.compare(data.password, user.password);
    if (!isCorrect || !user) {
        throw new UnauthorizedError("Não autorizado");
    }
    const token = generateToken({ id: user.id, email: user.email });
    return { user: omitPassword(user), token };
}
```

5. No arquivo `AuthController.ts` da camada Controller: 

```ts 
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService"
```

```ts
export class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await UserService.login({ email, password });
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
```

6. Na camada Routes, divide-se as rotas de cada entidade, e separando a de autenticação das demais.


6.1. Em `routes`, cria-se o arquivo `auth.routes.ts`, e então importa-se:

```ts
import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
```
6.2. Cria-se o objeto `router` e `authController`:

```ts
const router = Router();
const authController = new AuthController();
```
6.3. Cria-se a rota:

```ts
router.post("/login", authController.login.bind(authController));
export default router;
```

6.4. No arquivo principal `index.ts` das rotas, importamos:

```ts
import authRoutes from "./auth.routes";
const router = Router();
router.use("/auth", authRoutes);
export default router;
```