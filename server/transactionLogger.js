import winston from "winston";
import "winston-mongodb";
import dotenv from "dotenv";
dotenv.config();

const { combine, timestamp, printf } = winston.format;

const transactionFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const transactionLogger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), transactionFormat),
  transports: [
    new winston.transports.File({
      filename: "logs/transactions.log",
      level: "info",
    }),

    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      collection: "transaction_logs",
      level: "info",
      options: { useUnifiedTopology: true },
      format: combine(timestamp(), transactionFormat),
    }),
  ],
});

const logTransaction = (action, user, details = {}) => {
  const logMessage = `${action} by ${user} | Details: ${JSON.stringify(details)}`;
  transactionLogger.info(logMessage);
};

export default logTransaction
