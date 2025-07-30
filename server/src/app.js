import "dotenv/config";
import express from "express";
import { sequelize } from "./config/database.js";

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "http://localhost";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "it's working" });
});

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on: ${HOST}:${PORT}`));
  })
  .catch((err) => console.error("DB Connection error: ", err));
