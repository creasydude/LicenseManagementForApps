import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ErrorResponse from "../helpers/ErrorResponse";
import { JwtPayload } from "../interfaces/auth";
import Admin from "../models/Admin";

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("Authorization");
  if (!token) return next(new ErrorResponse("Token Not Found", 400));
  try {
    const { _id } = jwt.verify(
      token,
      <string>process.env.JWT_SECRET
    ) as JwtPayload;
    const user = await Admin.findById(_id);
    console.log(user);
    if (!user) return next(new ErrorResponse("User Not Found", 400));
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default userAuth;
