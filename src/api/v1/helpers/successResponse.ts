import { Response } from "express";
import { successResponseObj } from "../interfaces/successResponse";
const successResponse = (res: Response, statusCode: number, data: object) => {
  const bodyObj: successResponseObj = {
      success: true,
      ...data
  };
  res.status(statusCode).json(bodyObj);
};

export default successResponse;