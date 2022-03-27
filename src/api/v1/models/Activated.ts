import { Schema, model } from "mongoose";
import { ActivatedInterface } from "../interfaces/license";

const activatedSchema = new Schema<ActivatedInterface>({
  licenseKey: {
    type: String,
    required: true,
  },
  windowsId: {
    type: String,
    required: true,
  },
  //Maximum license expiration is one year so the thing below will remove the old documents and expired licenses
  expireDate: {
    type: Date,
    required: true,
    index: { expires: "1m" }
  }
});

const Activated = model<ActivatedInterface>("Activated", activatedSchema);
export default Activated;
