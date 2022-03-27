import { Response, Request, NextFunction } from "express";
import successResponse from "../helpers/successResponse";
import ErrorResponse from "../helpers/ErrorResponse";
import { ActivateLicenseInterface } from "../interfaces/license";
import {
  createLicenseHandler,
  showLicenseHandler,
  activateLicenseHandler,
  licenseStatusHandler,
} from "../services/license";

export const createLicense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { type, number }: any = req.params;
  if (!number || !type)
    return next(
      new ErrorResponse(
        "Enter 'number' you want to add , 'type' of license",
        400
      )
    );
  try {
    const license = await createLicenseHandler(type, number);
    successResponse(res, 201, { license });
  } catch (err) {
    next(err);
  }
};

export const showLicense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { type }: any = req.params;
  let { page, limit }: any = req.query;
  if (!page) page = 1;
  if (!limit) limit = 100;

  try {
    const { licenses, quantity } = await showLicenseHandler(type, page, limit);
    successResponse(res, 200, { quantity, page, limit, [type]: licenses });
  } catch (err) {
    next(err);
  }
};

export const activateLicense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { licenseKey, windowsId }: ActivateLicenseInterface = req.body;
  if (!licenseKey || !windowsId)
    return next(new ErrorResponse("Enter licenseKey, windowsId", 400));
  try {
    const activatedLicense = await activateLicenseHandler(
      licenseKey,
      windowsId
    );
    successResponse(res, 201, { activatedLicense });
  } catch (err) {
    next(err);
  }
};

export const licenseStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { licenseKey , windowsId }: any = req.body;
  if (!licenseKey) return next(new ErrorResponse("Enter licenseKey , windowsId", 400));
  try {
    const days = await licenseStatusHandler(licenseKey , windowsId);
    successResponse(res, 200, { message: "License is valid", days });
  } catch (err) {
    next(err);
  }
};

// license status moshkel dare | bayad licensekey ro biaram to req.body | bayad check kardane windows id ro ham ezafe konam