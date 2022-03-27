import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
import logger from "./config/Logger";
import connectDB from "./config/DB";
import { swaggerUIServe, swaggerUISetup } from "./config/swagger/config";
import errorHandler from "./api/v1/middlewares/errorHandler";
import authRoute from "./api/v1/routes/auth";
import licenseRoute from "./api/v1/routes/license";

//Dependencies
const app: Application = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser(<string>process.env.COOKIE_SECRET));
connectDB()

//Routes
app.use("/api/v1/auth",authRoute);
app.use("/api/v1/license",licenseRoute);

//API DOCS
if (<string>process.env.NODE_ENV === "development") {
  app.use("/api-docs", swaggerUIServe, swaggerUISetup);
}
//Error Handler
app.use(errorHandler);

//404 Error Handler
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

const PORT: number = parseInt(<string>process.env.PORT || "5000");
const server = app.listen(PORT, (): void => {
  logger.info(`Server Running On Port ${PORT}`);
});
process.on("unhandledRejection", (err: any) => {
  logger.error(err);
  server.close((): void => process.exit(1));
});


export default app;