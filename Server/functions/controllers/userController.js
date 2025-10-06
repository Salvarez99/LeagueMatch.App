const userService = require("../services/userService");

class UserController {
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
    } catch (err) {
      console.error("addUser error:", err);
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

      const updatedUser = await userService.updateUser(req.body);

      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (err) {
      console.error("updateUser error:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

// export singleton instance (so you can easily import it in index.js)
module.exports = new UserController();
