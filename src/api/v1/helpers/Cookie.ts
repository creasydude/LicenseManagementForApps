import { Response } from "express";
import { CookieOptions } from "express";

const Cookie = (res: Response, value: string) => {
  let options: CookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 30, // would expire after 1month
    httpOnly:true,
    secure: false,
    signed: true,
  };
  res.cookie("Authorization", value, options);
};

export default Cookie;
