import { IPayload } from "../auth/IPayload";
import { generateToken, verifyToken } from "../auth/jwt";

export class NewAuthService {
  generate(payload: IPayload) {
    return generateToken({
      id: payload.id,
      email: payload.email,
    });
  }

  verify(token: string) {
    return verifyToken(token);
  }
}