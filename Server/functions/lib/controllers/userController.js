"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const userService_1 = require("../services/userService");
class UserController {
    // POST /addUser
    async addUser(req, res) {
        try {
            if (req.method !== "POST") {
                return res.status(405).json({ error: "Method Not Allowed" });
            }
            const userDTO = req.body;
            const createdUser = await userService_1.userService.addUser(userDTO);
            return res.status(200).json({
                success: true,
                createdUser,
            });
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }
    }
    // POST /updateUser
    async updateUser(req, res) {
        try {
            if (req.method !== "POST") {
                return res.status(405).json({ error: "Method Not Allowed" });
            }
            const { uid, username, riotId } = req.body;
            const updatedUser = await userService_1.userService.updateUser(uid, username, riotId);
            return res.status(200).json({
                success: true,
                updatedUser,
            });
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
}
exports.UserController = UserController;
// Singleton export
exports.userController = new UserController();
