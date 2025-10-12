import logger from "../logger.js";

export const requestLogger = (req, res, next) => {
  const logMessage = `${req.method} ${req.originalUrl} - Body: ${JSON.stringify(req.body || {})}`;
  logger.info(logMessage);
  next();
};
