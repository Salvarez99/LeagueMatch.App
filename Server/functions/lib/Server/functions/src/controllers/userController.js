import { userService } from "../services/userService";
export class UserController {
    // POST /addUser
    async addUser(req, res) {
        try {
            if (req.method !== "POST") {
                return res.status(405).json({ error: "Method Not Allowed" });
            }
            const userDTO = req.body;
            const createdUser = await userService.addUser(userDTO);
            return res.status(200).json({
                success: true,
                data: createdUser,
            });
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                    code: err.code || null,
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
            const updatedUser = await userService.updateUser(uid, username, riotId);
            return res.status(200).json({
                success: true,
                data: updatedUser,
            });
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                    code: err.code || null,
                });
            }
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
}
// Singleton export
export const userController = new UserController();
