import License from "../models/License";
import Activated from "../models/Activated";
import ErrorResponse from "../helpers/ErrorResponse";
import { addTime, compareDays } from "../helpers/Time";
import LicenseGenerator from "../helpers/LicenseGenerator";
import ArrayPaginate from "../helpers/ArrayPaginate";

export const createLicenseHandler = async (type: string, number: number) => {
  if (
    type !== "sevenDay" &&
    type !== "oneMonth" &&
    type !== "threeMonth" &&
    type !== "sixMonth" &&
    type !== "oneYear"
  )
    throw new ErrorResponse("Wrong License Types , Check API Documents", 400);
  let docCheck = await License.find();
  if (docCheck.length === 0) {
    await License.create({});
    docCheck = await License.find();
  }
  let license = await License.findOneAndUpdate(
    docCheck[0]._id,
    {
      $push: { [type]: LicenseGenerator(number) },
    },
    { new: true }
  );
  return license;
};

export const showLicenseHandler = async (
  type: string,
  page: string,
  limit: string
) => {
  if (
    type !== "sevenDay" &&
    type !== "oneMonth" &&
    type !== "threeMonth" &&
    type !== "sixMonth" &&
    type !== "oneYear"
  )
    throw new ErrorResponse("Wrong License Types , Check API Documents", 400);
  const dbCheck = await License.find();
  if (dbCheck.length === 0)
  throw new ErrorResponse(
    "Admin Error : License Doc Not Found You Should Create Licenses First",
    400
  );
  const license = dbCheck.map((license) => {
    return license?.[type];
  });
  const quantity = license[0].length;
  const licenses = ArrayPaginate(license[0], parseInt(limit), parseInt(page));
  return { quantity, licenses };
};

export const activateLicenseHandler = async (
  licenseKey: string,
  windowsId: string
) => {
  const dbCheck = await License.find();
  if (dbCheck.length === 0)
    throw new ErrorResponse(
      "Admin Error : License Doc Not Found You Should Create Licenses First",
      400
    );
  // Recognize License Type Section
  let licenseType: null | string = null;
  let expireDate: null | string = null;
  if (dbCheck[0].sevenDay.includes(licenseKey)) {
    licenseType = "sevenDay";
    expireDate = addTime(10080); //Seven Day In Minute
  } else if (dbCheck[0].oneMonth.includes(licenseKey)) {
    licenseType = "oneMonth";
    expireDate = addTime(43200); //One Month In Minute
  } else if (dbCheck[0].threeMonth.includes(licenseKey)) {
    licenseType = "threeMonth";
    expireDate = addTime(129600); //Three Month In Minute
  } else if (dbCheck[0].sixMonth.includes(licenseKey)) {
    licenseType = "sixMonth";
    expireDate = addTime(259200); //Six Month In Minute
  } else if (dbCheck[0].oneYear.includes(licenseKey)) {
    licenseType = "oneYear";
    expireDate = addTime(518400); //One Year In Minute
  } else {
    throw new ErrorResponse("Invalid Licesne Key", 400);
  }
  // Activate License Section
  await License.findOneAndUpdate(
    dbCheck[0]._id,
    {
      $pull: { [licenseType]: licenseKey },
    },
    { new: true }
  );
  const activated = await Activated.create({
    licenseKey,
    windowsId,
    expireDate,
  });

  return activated;
};

export const licenseStatusHandler = async (
  licenseKey: string,
  windowsId: string
) => {
  const license = await Activated.findOne({ licenseKey });
  if (!license) throw new ErrorResponse("Invalid License Or Expired", 400);
  if (license?.windowsId !== windowsId) throw new ErrorResponse("Windows Id Not Match", 400);
  const days = compareDays(license.expireDate.toString());
  return days;
};
