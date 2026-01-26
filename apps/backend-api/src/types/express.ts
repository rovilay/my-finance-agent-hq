import { User } from '../nest/auth/models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
