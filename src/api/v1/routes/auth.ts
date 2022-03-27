import express from "express";
import {
  register,
  registerConfirm,
  validationResend,
  login,
  logout,
  refreshToken,
} from "../controllers/auth";
const Router = express.Router();

Router.post("/register", register);
Router.post("/registerConfirm/:emailValidationKey", registerConfirm);
Router.post("/validationResend/:email", validationResend);
Router.post("/login", login);
Router.get("/refreshToken", refreshToken);
Router.delete("/logout", logout);

export default Router;
