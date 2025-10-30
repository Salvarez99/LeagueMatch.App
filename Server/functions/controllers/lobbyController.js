// controllers/lobbyController.js
const lobbyService = require("../services/lobbyService");

class LobbyController {
  async create(req, res) {
    try {
      const {
        hostId,
        gameMap,
        gameMode = null,
        hostPosition = null,
        championId = null,
        rankFilter = [],
      } = req.body;

      const newLobby = await lobbyService.create({
        hostId,
        gameMap,
        gameMode,
        hostPosition,
        championId,
        rankFilter,
      });

      res.status(201).json({
        message: "Lobby created successfully",
        id: newLobby.id,
      });
    } catch (err) {
      console.error("Error creating lobby:", err);
      res.status(500).json({ error: err.message });
    }
  }

  async getAvailableLobbies(req, res) {
    const { desiredRole } = req.body;
    try {
      const lobbies = await lobbyService.getAvailableLobbies(desiredRole);
      res.status(200).json({
        message: "Available lobbies fetched",
        lobbies,
      });
    } catch (err) {
      console.error("Error getting available lobbies:", err);
      res.status(500).json({ error: err.message });
    }
  }

  async getLobbyById(req, res) {
    try {
      const lobbyId = req.query.lobbyId; // get from query param
      if (!lobbyId) {
        return res
          .status(400)
          .json({ error: "lobbyId query parameter is required" });
      }

      const lobby = await lobbyService.getLobbyById(lobbyId);

      if (!lobby) {
        return res.status(404).json({ error: "Lobby not found" });
      }

      res.status(200).json(lobby);
    } catch (err) {
      console.error("getLobbyById error:", err);
      res.status(500).json({ error: err.message });
    }
  }

  async joinLobbyById(req, res) {
    try {
      if (req.method !== "POST") {
        return res
          .status(405)
          .json({ success: false, message: "Method not allowed" });
      }

      const { lobbyId, uid, role } = req.body;

      if (!lobbyId || !uid || !role) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      const updatedLobby = await lobbyService.joinLobby(lobbyId, { uid, role });

      return res.status(200).json({
        success: true,
        data: updatedLobby,
      });
    } catch (error) {
      console.error("Error joining lobby:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async leaveLobbyById(req, res) {
    try {
      if (req.method !== "DELETE") {
        return res
          .status(405)
          .json({ success: false, message: "Method not allowed" });
      }

      const { lobbyId, uid } = req.query;

      if (!lobbyId || !uid) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      const updatedLobby = await lobbyService.leaveLobby(lobbyId, uid);

      return res.status(200).json({
        success: true,
        data: updatedLobby,
      });
    } catch (error) {
      console.error("Error joining lobby:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new LobbyController();
