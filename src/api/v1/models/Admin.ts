import { Schema, model } from "mongoose";
import { AdminInterface } from "../interfaces/auth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new Schema<AdminInterface>({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid Email"],
  },
  password: {
    type: String,
    required: true,
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/,
      "Invalid Password",
    ],
  },
  emailValidationKey: {
    type: String,
    unique: true,
  },
  emailValidationExpire: {
    type: Date,
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
});

adminSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const hashedPassword: string = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (err) {
    throw err;
  }
});

adminSchema.methods.comparePasswords = async function (password: string) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw err;
  }
};
adminSchema.methods.createTokens = function () {
  const accessToken: string = jwt.sign(
    { _id: this._id },
    <string>process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  const refreshToken: string = jwt.sign(
    { _id: this._id },
    <string>process.env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );
  return { accessToken, refreshToken };
};

const Admin = model<AdminInterface>("Admin", adminSchema);
export default Admin;
