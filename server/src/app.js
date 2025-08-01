import "dotenv/config";

import express from "express";
import { sequelize } from "./config/database.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import error_handler from "./middlewares/error.middleware.js";
import logger from "./config/logger.js";

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "http://localhost";
const CLIENT_URL = process.env.CLIENT_URL || "";
const isProd = process.env.NODE_ENV === "production";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth/", authRoutes);

app.use(error_handler);

// TODO: Extract to middlewars
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        timestamp: new Date().toISOString(),
    });
    next();
});

sequelize
    .sync()
    .then(() => {
        app.listen(PORT, () => {
            logger.info("Server started successfully", {
                port: PORT,
                enviroment: isProd ? "production" : "development",
                cliendUrl: CLIENT_URL,
            });
            console.log(`Listening on ${HOST}:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("DB Connection error: ", err);
    });
