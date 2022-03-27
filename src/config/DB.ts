import mongoose from "mongoose";
import logger from "./Logger";

const connectDB = async () => {
    await mongoose.connect(<string>process.env.MONGO_URI);
    logger.info("DB Connected!");
};

export default connectDB;