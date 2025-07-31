import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import HttpStatus from "../constants/status_codes.js";
import { MAX_COOKIE_AGE, COOKIE_EXPIRES_TIME } from "../constants/constants.js";

const JWT_TOKEN = process.env.JWT_SECRET;

const signin_token = (payload) =>
    jwt.sign(payload, JWT_TOKEN, { expiresIn: COOKIE_EXPIRES_TIME });

export const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(HttpStatus.UNAUTORIZED);
    try {
        req.user = jwt.verify(token, JWT_TOKEN);
        next();
    } catch (err) {
        res.sendStatus(HttpStatus.UNAUTORIZED);
    }
};

export const register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hash, email });
        res.status(HttpStatus.CREATED).json({ id: user.id, email: user.email });
    } catch (err) {
        next(err);
    }
};

export const get_current_user = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.sub);
        if (!user) return res.sendStatus(HttpStatus.UNAUTORIZED);
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        if (!req.body)
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json({ message: "No credentials passed" });
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res
                .status(HttpStatus.UNAUTORIZED)
                .json({ message: "Invalid credentials" });
        }
        const token = signin_token({ sub: user.id, role: user.role });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.isProd ?? false,
            sameSite: "strict",
            maxAge: MAX_COOKIE_AGE,
        });
        res.json({ id: user.id, email: user.email, username: user.username });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.isProd ?? false,
        sameSite: "strict",
    });
    res.sendStatus(HttpStatus.NO_CONTENT);
};
