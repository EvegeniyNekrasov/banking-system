import express from "express";
import { get_user_by_id } from "../controllers/user.controller.js";
import { auth } from "../controllers/auth.controller.js";

const userRoutes = express.Router();

userRoutes.post("/get-user-by-id", auth, get_user_by_id);

export default userRoutes;
