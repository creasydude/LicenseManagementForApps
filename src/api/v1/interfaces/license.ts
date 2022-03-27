import { Document } from "mongoose";

export interface LicenseInterface extends Document {
  sevenDay: string[];
  oneMonth: string[];
  threeMonth: string[];
  sixMonth: string[];
  oneYear: string[];
}

export interface ActivatedInterface extends Document {
  licenseKey: string;
  windowsId: string;
  expireDate: Date;
  expireAt: Date;
}

export interface ActivateLicenseInterface {
  licenseKey: string;
  windowsId: string;
}
