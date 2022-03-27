import { NextFunction, Response, Request } from "express";
import { RegisterInterface, LoginInterface } from "../interfaces/auth";
import ErrorResponse from "../helpers/ErrorResponse";
import successResponse from "../helpers/successResponse";
import Cookie from "../helpers/Cookie";
import {
  createUser,
  registerConfirmHandler,
  validationResendHandler,
  loginHandler,
  refreshTokenHandler,
} from "../services/auth";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, registerAccessKey }: RegisterInterface = req.body;
  if (
    !email ||
    !password ||
    registerAccessKey !== <string>process.env.REGISTER_ACCESS_KEY
  )
    return next(
      new ErrorResponse("Enter Credentials Or Invalid Access Key", 400)
    );
  try {
    const user = await createUser(email, password);
    successResponse(res, 201, {
      message: "User Created, Verification Link Sent",
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const registerConfirm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { emailValidationKey }: any = req.params;
  if (!emailValidationKey)
    return next(new ErrorResponse("Enter Email Validation Key", 400));
  try {
    const user = await registerConfirmHandler(emailValidationKey);
    successResponse(res, 200, { message: "Your Account Validated", user });
  } catch (err) {
    next(err);
  }
};

export const validationResend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email }: any = req.params;
  if (!email) return next(new ErrorResponse("Enter Email", 400));
  try {
    const user = await validationResendHandler(email);
    successResponse(res, 200, { message: "Validation Resend", user });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password }: LoginInterface = req.body;
  if (!email || !password)
    return next(new ErrorResponse("Enter Email , Password", 400));
  try {
    const { accessToken, refreshToken } = await loginHandler(email, password);
    Cookie(res, refreshToken);
    successResponse(res, 200, { accessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { Authorization } = req.signedCookies;
  try {
    if (!Authorization)
      return next(new ErrorResponse("You Are Not Logged In!", 400));
    res.clearCookie("Authorization");
    successResponse(res, 200, { message: "Logged Out" });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { Authorization } = req.signedCookies;
  try {
    const accessToken = await refreshTokenHandler(Authorization);
    successResponse(res, 200, { accessToken });
  } catch (err) {
    next(err);
  }
};
