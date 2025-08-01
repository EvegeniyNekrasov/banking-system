import HttpStatus from "../constants/status_codes.js";
import logger from "../config/logger.js";

const error_handler = (err, req, res, next) => {
    logger.error("Unhandled error", {
        error: err.message,
        stack: err.stack,
        status: err.status,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        body: req.body,
    });

    const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal error";
    res.status(status).json({ message });
};

export default error_handler;
