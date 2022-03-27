import express from "express";
import userAuth from "../middlewares/userAuth";
import {
  createLicense,
  showLicense,
  activateLicense,
  licenseStatus,
} from "../controllers/license";
const Router = express.Router();

Router.post("/create/:type/:number", userAuth, createLicense);
Router.post("/show/:type", userAuth, showLicense);
Router.post("/activate", activateLicense);
Router.get("/status", licenseStatus)

export default Router;
