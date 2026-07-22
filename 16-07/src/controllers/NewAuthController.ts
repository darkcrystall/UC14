import { loginSchema, LoginUserDTO } from "./../schemas/user.schema";
import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { NewAuthService } from "../services/NewAuthService";

export class NewAuthController {
  private authService: NewAuthService = new NewAuthService();

  async login(req: Request, res: Response) {
    const loginData: LoginUserDTO = loginSchema.parse(req.body);

    const loggedUser = await UserService.login(loginData);

    const token = await this.authService.generate({
      id: loggedUser.user.id,
      email: loggedUser.user.email,
    });

    console.log("Token:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    });

    console.log("Headers:", res.getHeaders());

    return res.status(200).json({
      message: "Login realizado com sucesso",
    });
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("token");

    return res.sendStatus(204);
  }
}
