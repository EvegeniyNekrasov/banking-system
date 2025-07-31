import "dotenv/config";
import express from "express";
import { sequelize } from "./config/database.js";

import authRoutes from "./routes/auth.routes.js";
import error_handler from "./middlewares/error.middleware.js";

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "http://localhost";

const app = express();
app.use(express.json());

app.use("/api/auth/", authRoutes);

app.use(error_handler);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on: ${HOST}:${PORT}`));
  })
  .catch((err) => console.error("DB Connection error: ", err));
