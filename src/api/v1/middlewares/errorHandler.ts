import { Request, Response, NextFunction } from "express";
import { errorHandlerObj } from "../interfaces/errorHandler";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = { ...err };
  error.message = err.message;

  const bodyObj: errorHandlerObj = {
    success: false,
    message: error.message || "Internal Server Error",
  };
  res.status(error.statusCode || 500).json(bodyObj);
};

export default errorHandler;