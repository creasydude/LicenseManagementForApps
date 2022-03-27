import { Schema, model } from "mongoose";
import { LicenseInterface } from "../interfaces/license";

const licenseSchema = new Schema<LicenseInterface>({
  sevenDay: {
      type: [String],
      default: []
  },
  oneMonth: {
    type: [String],
    default: []
  },
  threeMonth: {
      type: [String],
      default: []
  },
  sixMonth: {
    type: [String],
    default: []
  },
  oneYear: {
    type: [String],
    default: []
  },
});

const License = model<LicenseInterface>("License", licenseSchema);
export default License;
