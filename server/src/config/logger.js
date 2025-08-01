import winston from "winston";

const LOG_LEVEL = process.env.LOG_LEVEL || "debug";
const isProd = process.env.NODE_ENV === "production";

const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp({
            format: "DD-MM-YYYY HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [new winston.transports.File({ filename: "log/standart.log" })],
    defaultMeta: { service: "banking-service" },
    exceptionHandlers: [
        new winston.transports.File({ filename: "log/exceptions.log" }),
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: "log/rejections.log" }),
    ],
});

if (!isProd) {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

export default logger;
