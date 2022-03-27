import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, errors, json } = format;

const buildDevLogger = () => {
    const logFormat = printf(({ level, message, timestamp, stack }) => {
      return `${timestamp} ${level}: ${stack || message}`;
    });
  
    return createLogger({
      format: combine(
        format.colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        logFormat
      ),
      transports: [new transports.Console()],
    });
  };
  
  const buildProdLogger = () => {
    return createLogger({
      format: combine(timestamp(), errors({ stack: true }), json()),
      transports: [new transports.Console()],
    });
  };
  
  let logger : any = null;
  if (process.env.NODE_ENV === 'development') {
    logger = buildDevLogger();
  } else {
    logger = buildProdLogger();
  }
  
  export default logger;