import express from "express";
const authRoutes = express.Router();
import {
    login,
    logout,
    register,
    get_current_user,
    auth,
} from "../controllers/auth.controller.js";

authRoutes.post("/login", login);
authRoutes.post("/register", register);
authRoutes.post("/current-user", auth, get_current_user);
authRoutes.post("/logout", logout);

export default authRoutes;
