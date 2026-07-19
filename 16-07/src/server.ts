import express, { Application } from "express";
import * as dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import { ensureDatabaseExists } from "./config/ensure-database"
import router from "./routes/index";
import { errorHandler } from "./middlewares/error-handler";
const app: Application = express();
dotenv.config();
const PORT = process.env.PORT; // pega o valor da variável PORT do .env
app.use(express.json());
app.use(router);
// .initialize() é um método do TypeORM que abre a conexão com o banco
// usando as configurações definidas em data-source.ts, carrega as
// entidades e executa a sincronização (criação das tabelas, já que
// synchronize: true está definido). É assíncrono, por isso retorna uma
// Promise: o que está dentro de .then() roda se der certo, e o que está
// dentro de .catch() roda se houver erro.
async function initializeServer() {
  await ensureDatabaseExists();
  await AppDataSource.initialize();
  console.log("Banco conectado com sucesso");
  app.use(errorHandler)
  app.listen(PORT, () => console.log("Servidor rodando"));
}
initializeServer().catch((error) =>
  console.log("Erro ao se conectar: " + error)
);