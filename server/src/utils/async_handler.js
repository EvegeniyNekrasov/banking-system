import logger from "../config/logger.js";
import HttpStatus from "../constants/status_codes.js";

export const async_handler = ({ requiredFields = [] } = {}, handler) => {
    return async (req, res, next) => {
        for (const field of requiredFields) {
            if (!req.body || req.body[field] === null) {
                logger.warn(`Missing field: ${field}`, { id: req.ip });
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json({ message: `missing field: ${field}` });
            }
        }

        try {
            await handler(req, res, next);
        } catch (err) {
            logger.error(err.message, {
                error: err.stack,
                ip: req.ip,
                userAgent: req.get("User-Agent"),
            });
        }
    };
};
