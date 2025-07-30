import "dotenv/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_STORAGE,
  logging: false,
});
