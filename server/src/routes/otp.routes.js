import { Router } from "express";
import {
    generateAndSendOTP,
    verifyOTP,
    resendOTP,
} from "../controllers/otp.controller.js";
import { auth } from "../controllers/auth.controller.js";

const otpRoutes = Router();

otpRoutes.post("/generate", generateAndSendOTP);
otpRoutes.post("/verify", verifyOTP);
otpRoutes.post("/resend", resendOTP);
otpRoutes.post("/generate-secure", auth, generateAndSendOTP);

export default otpRoutes;
