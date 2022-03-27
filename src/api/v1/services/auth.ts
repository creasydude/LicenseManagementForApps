import { addTime, compareTime } from "../helpers/Time";
import Generator from "../helpers/Generator";
import Admin from "../models/Admin";
import ErrorResponse from "../helpers/ErrorResponse";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

const generateVerificationLink = () => {
  const emailValidationKey: string = Generator("numbers+letters", 10);
  const emailValidationExpire: string = addTime(30);
  return { emailValidationKey, emailValidationExpire };
};

export const createUser = async (email: string, password: string) => {
  const { emailValidationKey, emailValidationExpire } =
    generateVerificationLink();
  const user = await Admin.create({
    email,
    password,
    emailValidationKey,
    emailValidationExpire,
  });
  //You Should Implant Send Mail Logic Here
  //
  //You Should Implant Send Mail Logic Here
  return user;
};

export const registerConfirmHandler = async (emailValidationKey: any) => {
  let user = await Admin.findOne({ emailValidationKey });
  if (!user) throw new ErrorResponse("Invalid Email Validation Key", 400);
  user.emailValidated = true;
  user.emailValidationKey = undefined;
  user.emailValidationExpire = undefined;
  await user.save();
  return user;
};

export const validationResendHandler = async (email: string) => {
  let user = await Admin.findOne({ email });
  if (!user) throw new ErrorResponse("User Not Found", 400);
  const { emailValidationKey, emailValidationExpire } =
    generateVerificationLink();
  if (user?.emailValidated)
    throw new ErrorResponse("Your Account Already Verified", 400);
  if (compareTime(user?.emailValidationExpire!))
    throw new ErrorResponse("Verify Link Exist Try Again Later", 400);
  user.emailValidationKey = emailValidationKey;
  user.emailValidationExpire = emailValidationExpire;
  await user.save();
  return user;
};

export const loginHandler = async (email: string, password: string) => {
  const user = await Admin.findOne({ email });
  if (!user) throw new ErrorResponse("User Not Found", 400);
  const pwCorrect = await user.comparePasswords(password);
  if (!pwCorrect) throw new ErrorResponse("Invalid Password", 400);
  if (!user.emailValidated)
    throw new ErrorResponse("You Account Not Verified", 400);
  const { accessToken, refreshToken } = user.createTokens();
  if (!accessToken || !refreshToken)
    throw new ErrorResponse("Access Token Or Refresh Token Missing", 400);
  return { accessToken, refreshToken };
};

export const refreshTokenHandler = async (Authorization: string) => {
  const { _id } = jwt.verify(
    Authorization,
    <string>process.env.JWT_REFRESH_TOKEN_SECRET
  ) as JwtPayload;
  const user = await Admin.findById(_id);
  if (!user) throw new ErrorResponse("User Not Found", 400);
  const { accessToken } = user.createTokens();
  return accessToken;
};
