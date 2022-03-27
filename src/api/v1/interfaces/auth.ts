import { Document } from "mongoose";

export interface RegisterInterface {
  email: string;
  password: string;
  registerAccessKey: string;
}

export interface LoginInterface {
  email: string;
  password: string;
}

export interface tokenObj {
  accessToken: string;
  refreshToken: string;
}

export interface AdminInterface extends Document{
  email: string;
  password: string;
  emailValidationKey?: string;
  emailValidationExpire?: string;
  emailValidated: boolean;
  comparePasswords: (password: string) => Promise<boolean>;
  createTokens: () => tokenObj;
}

export interface JwtPayload {
  _id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
