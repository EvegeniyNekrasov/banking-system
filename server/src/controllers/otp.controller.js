import "dotenv/config";

import nodemailer from "nodemailer";
import crypto from "crypto";
import { Op } from "sequelize";

import logger from "../config/logger.js";
import Otp from "../models/otp.model.js";
import HttpStatus from "../constants/status_codes.js";

import { async_handler } from "../utils/async_handler.js";
import HTML_TEMPLATE from "../utils/mail-template.js";

const { MAIL_PORT, MAIL_USER, MAIL_PASS, NODE_ENV, MAIL_HOST, MAIL_SERVICE } =
    process.env;

const transporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: NODE_ENV === "production",
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
});

const mail_sender = async (mailDetail) => {
    try {
        logger.info("Attempting to send email", {
            to: mailDetail.to,
            subject: mailDetail.subject,
        });

        const info = await transporter.sendMail(mailDetail);

        logger.info("Email sent successfully", {
            messageId: info.messageId,
            to: mailDetail.to,
        });

        return info;
    } catch (err) {
        logger.error("Email sending failed", {
            to: mailDetail.to,
            error: err.message,
            code: err.code,
        });
        throw err;
    }
};

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const sendEmail = async (
    to,
    subject,
    otp,
    purpose = "GENERAL",
    retries = 3
) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            logger.info("Sending email attempt", {
                to,
                subject,
                purpose,
                attempt,
                maxRetries: retries,
            });

            const options = {
                from: "TESTING: <sender@gmail.com>",
                to,
                subject: subject,
                html: HTML_TEMPLATE(otp, purpose),
            };

            await mail_sender(options);

            logger.info("Email sent successfully on attempt", {
                to,
                purpose,
                attempt,
            });

            return;
        } catch (err) {
            const transient =
                [
                    "ESOCKET",
                    "ETIMEDOUT",
                    "ECONNRESET",
                    "EAI_AGAIN",
                    "429",
                ].includes(err.code) ||
                (err.status && err.status >= 500);

            logger.warn("Email send attempt failed", {
                to,
                purpose,
                code: err.code || err.status,
                message: err.message,
                attempt,
                retriesLeft: retries - attempt,
                isTransient: transient,
            });

            if (attempt === retries || !transient) {
                logger.error("All email send attempts failed", {
                    to,
                    purpose,
                    totalAttempts: attempt,
                    error: err.message,
                    code: err.code || err.status,
                });
                throw err;
            }
            const delay = 2 ** attempt * 1000;
            logger.info("Waiting before retry", {
                delay,
                nextAttempt: attempt + 1,
            });
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};

const sendOTPEmail = async (email, otp, purpose) => {
    const purposeMessages = {
        REGISTRATION: "Complete your registration",
        LOGIN: "Verify your login",
        TRANSFER: "Confirm your transfer",
        PASSWORD_RESET: "Reset your password",
    };

    const title = purposeMessages[purpose] || "Verification Required";
    const subject = `Your Banking OTP: ${otp}`;

    logger.info("Preparing to send OTP email", {
        email,
        purpose,
        title,
    });

    await sendEmail(email, subject, otp, purpose);

    logger.info("OTP email sent successfully", {
        email,
        purpose,
    });
};

const cleanExpiredOTPs = async () => {
    try {
        logger.info("Starting cleanup of expired OTPs");

        const deleted = await Otp.destroy({
            where: { expiresAt: { [Op.lt]: new Date() } },
        });

        if (deleted > 0) {
            logger.info("Expired OTPs cleaned successfully", {
                deletedCount: deleted,
            });
        } else {
            logger.info("No expired OTPs found to clean");
        }

        return deleted;
    } catch (err) {
        logger.error("Error cleaning expired OTPs", {
            error: err.message,
            stack: err.stack,
        });
        throw err;
    }
};

export const generateAndSendOTP = async_handler(
    { requiredFields: ["email", "purpose"] },
    async (req, res) => {
        const { email, purpose } = req.body;

        logger.info("OTP generation request received", { email, purpose });

        try {
            await cleanExpiredOTPs();

            const existing = await Otp.findOne({
                where: {
                    email,
                    purpose,
                    verified: false,
                    expiresAt: { [Op.gt]: new Date() },
                },
            });

            if (existing) {
                const expiresIn = Math.ceil(
                    (existing.expiresAt - new Date()) / 1000
                );

                logger.warn("OTP already exists for user", {
                    email,
                    purpose,
                    expiresIn,
                    otpId: existing.id,
                });

                return res.status(429).json({
                    message: "OTP already sent",
                    expiresIn: expiresIn,
                });
            }

            const otp = generateOTP();
            const expiresAt = new Date(
                Date.now() +
                    (NODE_ENV === "production" ? 5 * 60 * 1000 : 15 * 1000)
            );

            const otpRecord = await Otp.create({
                email,
                otp,
                purpose,
                expiresAt,
                attempts: 0,
                verified: false,
            });

            logger.info("OTP record created", {
                id: otpRecord.id,
                email,
                purpose,
                expiresAt,
            });

            await sendOTPEmail(email, otp, purpose);

            const expiresInMinutes =
                NODE_ENV === "production" ? 5 : Math.ceil(15 / 60);

            logger.info("OTP generation completed successfully", {
                id: otpRecord.id,
                email,
                purpose,
                expiresInMinutes,
            });

            res.status(HttpStatus.OK).json({
                message: "OTP sent",
                expiresIn: expiresInMinutes,
            });
        } catch (err) {
            logger.error("Error in OTP generation process", {
                email,
                purpose,
                error: err.message,
                stack: err.stack,
            });
            throw err;
        }
    }
);

export const verifyOTP = async_handler(
    { requiredFields: ["email", "otp", "purpose"] },
    async (req, res) => {
        const { email, otp, purpose } = req.body;
        console.log("email: ", email);
        console.log("otp: ", otp);
        console.log("purpose: ", purpose);

        logger.info("OTP verification request received", { email, purpose });

        try {
            const record = await Otp.findOne({
                where: {
                    email,
                    purpose,
                    verified: false,
              
                },
            });

            if (!record) {
                logger.warn("OTP verification failed - no valid record found", {
                    email,
                    purpose,
                });

                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json({ message: "Invalid or expired OTP" });
            }

            if (record.attempts >= 3) {
                logger.warn("OTP verification failed - too many attempts", {
                    email,
                    purpose,
                    attempts: record.attempts,
                    otpId: record.id,
                });

                await record.update({ expiresAt: new Date() });

                return res
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .json({ message: "Too many attempts" });
            }

            if (record.otp !== otp) {
                const newAttempts = record.attempts + 1;
                await record.increment("attempts");

                logger.warn("OTP verification failed - incorrect OTP", {
                    email,
                    purpose,
                    attempts: newAttempts,
                    remainingAttempts: 3 - newAttempts,
                    otpId: record.id,
                });

                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "Incorrect OTP",
                    attemptsRemaining: 3 - newAttempts,
                });
            }

            await record.update({ verified: true, expiresAt: new Date() });

            logger.info("OTP verification successful", {
                email,
                purpose,
                otpId: record.id,
            });

            res.status(HttpStatus.OK).json({
                message: "OTP verified",
                verified: true,
            });
        } catch (err) {
            logger.error("Error in OTP verification process", {
                email,
                purpose,
                error: err.message,
                stack: err.stack,
            });
            throw err;
        }
    }
);

export const resendOTP = async_handler(
    { requiredFields: ["email", "purpose"] },
    async (req, res) => {
        const { email, purpose } = req.body;

        logger.info("OTP resend request received", { email, purpose });

        try {
            const updated = await Otp.update(
                { expiresAt: new Date() },
                {
                    where: {
                        email: email,
                        purpose: purpose,
                        verified: false,
                    },
                }
            );

            logger.info("Previous OTPs expired for resend", {
                email,
                purpose,
                expiredCount: updated[0],
            });

            return generateAndSendOTP(req, res);
        } catch (err) {
            logger.error("Error in OTP resend process", {
                email,
                purpose,
                error: err.message,
                stack: err.stack,
            });
            throw err;
        }
    }
);
