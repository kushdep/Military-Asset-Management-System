import winston from "winston";
import "winston-mongodb";
import dotenv from "dotenv";

dotenv.config();

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),

    new winston.transports.File({ filename: "logs/combined.log" }),

    new winston.transports.MongoDB({    
      level: "info",
      db: process.env.MONGO_URI,
      options: { useUnifiedTopology: true },
      collection: "app_logs",
      tryReconnect: true,
      format: combine(timestamp(), logFormat),
    }),
  ],
});

export default logger;
