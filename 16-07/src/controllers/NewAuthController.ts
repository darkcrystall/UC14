import { loginSchema, LoginUserDTO } from "./../schemas/user.schema";
import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { NewAuthService } from "../services/NewAuthService";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export class NewAuthController {
  private authService: NewAuthService = new NewAuthService();

  async login(req: Request, res: Response) {
    const loginData: LoginUserDTO = loginSchema.parse(req.body);

    const loggedUser = await UserService.login(loginData);

    const token = await this.authService.generate({
      id: loggedUser.user.id,
      email: loggedUser.user.email,
    });

    // console.log("Token:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // true
      sameSite: "none", // lax
      maxAge: 1000 * 60 * 60, //1h
    });

    // console.log("Headers:", res.getHeaders());

    return res.status(200).json({
      message: "Login realizado com sucesso",
    });
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("token");
    return res.sendStatus(204);
  }

  async checkUserPassword(req: Request, res: Response) {
    console.log(req.user)
    const { password } = req.body;
    if (!req.user?.email) {
      throw new UnauthorizedError();
    }
    const passwordIsValid = await UserService.checkUserPassword(
      req.user?.email,
      password
    );
    if (!passwordIsValid) {
      throw new UnauthorizedError();
    }
    return res.status(200).json({ message: "Senha válida"})
  }
}
