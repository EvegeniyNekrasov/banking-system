import logger from "../config/logger.js";
import HttpStatus from "../constants/status_codes.js";
import User from "../models/user.model.js";
import { async_handler } from "../utils/async_handler.js";

export const get_user_by_id = async_handler(
    { requiredFields: ["id"] },
    async (req, res) => {
        const { id } = req.body;
        logger.debug(`Request user by id: ${id}`);
        const user = await User.findByPk(id);
        if (!user) {
            return res
                .status(HttpStatus.NOT_FOUND)
                .json({ message: `User with id: ${id} not found` });
        }

        res.json({
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        });
    }
);
