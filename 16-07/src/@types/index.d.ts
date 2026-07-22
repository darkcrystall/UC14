import { IPayload } from '../auth/IPayload';

declare global {
  namespace Express {
    interface Request {
      user?: IPayload;
    }
  }
}

export {};