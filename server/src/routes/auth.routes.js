import express from "express";
const authRoutes = express.Router();
import { login, logout, register } from "../controllers/auth.controller.js";

authRoutes.post("/login", login);
authRoutes.post("/register", register);
authRoutes.post("/logout", logout);

export default authRoutes;
